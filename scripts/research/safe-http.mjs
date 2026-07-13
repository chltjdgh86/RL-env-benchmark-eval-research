import { request as httpsRequest } from "node:https";
import { isIP } from "node:net";

import { classifyNetworkTarget } from "./link-audit-policy.mjs";

export const createPinnedLookup = (networkTarget) => {
  const candidates = networkTarget.addresses.map((address) => ({ address, family: isIP(address) }));
  if (candidates.length === 0 || candidates.some((candidate) => candidate.family === 0)) {
    throw new Error("No validated network address is available");
  }
  return (_hostname, options, callback) => {
    const requestedFamily = typeof options === "object" ? Number(options.family ?? 0) : 0;
    const compatible = requestedFamily === 0
      ? candidates
      : candidates.filter((candidate) => candidate.family === requestedFamily);
    if (compatible.length === 0) {
      callback(Object.assign(new Error("No validated address for requested family"), { code: "ENOTFOUND" }));
      return;
    }
    if (typeof options === "object" && options.all === true) callback(null, compatible);
    else callback(null, compatible[0].address, compatible[0].family);
  };
};

export async function requestPinnedHttps(url, {
  method = "GET",
  headers = {},
  timeoutMs = 15_000,
  maxBytes = 65_536,
  lookupFn,
} = {}) {
  const networkTarget = await classifyNetworkTarget(url, lookupFn);
  if (networkTarget.unsafeTarget) {
    return {
      status: null,
      headers: {},
      body: Buffer.alloc(0),
      truncated: false,
      error: networkTarget.reason,
    };
  }

  return new Promise((resolve) => {
    let settled = false;
    let timer;
    const finish = (result) => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      resolve(result);
    };
    const request = httpsRequest(url, {
      method,
      headers,
      lookup: createPinnedLookup(networkTarget),
    }, (response) => {
      const status = response.statusCode ?? null;
      const responseHeaders = response.headers;
      if (method === "HEAD" || maxBytes === 0) {
        response.resume();
        response.once("end", () => finish({ status, headers: responseHeaders, body: Buffer.alloc(0), truncated: false, error: null }));
        response.once("aborted", () => finish({ status, headers: responseHeaders, body: Buffer.alloc(0), truncated: false, error: "response-aborted" }));
        return;
      }

      const chunks = [];
      let retainedBytes = 0;
      response.on("data", (chunk) => {
        const buffer = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk);
        const remaining = Math.max(0, maxBytes - retainedBytes);
        if (remaining > 0) {
          const retained = buffer.subarray(0, remaining);
          chunks.push(retained);
          retainedBytes += retained.byteLength;
        }
        if (buffer.byteLength > remaining) {
          finish({ status, headers: responseHeaders, body: Buffer.concat(chunks), truncated: true, error: null });
          response.destroy();
        }
      });
      response.once("end", () => finish({ status, headers: responseHeaders, body: Buffer.concat(chunks), truncated: false, error: null }));
      response.once("aborted", () => finish({ status, headers: responseHeaders, body: Buffer.concat(chunks), truncated: false, error: "response-aborted" }));
      response.once("error", (error) => finish({ status, headers: responseHeaders, body: Buffer.concat(chunks), truncated: false, error: `${error.name}: ${error.message}` }));
    });
    timer = setTimeout(() => request.destroy(Object.assign(new Error(`Request timed out after ${timeoutMs}ms`), { name: "TimeoutError" })), timeoutMs);
    request.once("error", (error) => finish({
      status: null,
      headers: {},
      body: Buffer.alloc(0),
      truncated: false,
      error: `${error.name}: ${error.message}`,
    }));
    request.end();
  });
}
