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
  signal,
} = {}) {
  const controller = new AbortController();
  let timedOut = false;
  const abortFromCaller = () => controller.abort(signal?.reason);
  if (signal?.aborted === true) abortFromCaller();
  else signal?.addEventListener("abort", abortFromCaller, { once: true });
  const timer = setTimeout(() => {
    timedOut = true;
    controller.abort(Object.assign(new Error(`Request timed out after ${timeoutMs}ms`), { name: "TimeoutError" }));
  }, timeoutMs);
  const failure = (error) => ({
    status: null,
    headers: {},
    body: Buffer.alloc(0),
    truncated: false,
    error: timedOut ? `TimeoutError: Request timed out after ${timeoutMs}ms` : error,
  });

  try {
    let resolveAbort;
    const aborted = new Promise((resolve) => {
      resolveAbort = () => resolve(null);
      if (controller.signal.aborted) resolveAbort();
      else controller.signal.addEventListener("abort", resolveAbort, { once: true });
    });
    const guardedLookup = lookupFn === undefined
      ? undefined
      : (hostname, options) => lookupFn(hostname, { ...options, signal: controller.signal });
    const networkTarget = await Promise.race([
      classifyNetworkTarget(url, guardedLookup),
      aborted,
    ]);
    controller.signal.removeEventListener("abort", resolveAbort);
    if (networkTarget === null || controller.signal.aborted) return failure("AbortError: Request aborted");
    if (networkTarget.unsafeTarget) return failure(networkTarget.reason);

    return await new Promise((resolve) => {
      let settled = false;
      const finish = (result) => {
        if (settled) return;
        settled = true;
        resolve(result);
      };
      const request = httpsRequest(url, {
        method,
        headers,
        lookup: createPinnedLookup(networkTarget),
        signal: controller.signal,
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
      request.once("error", (error) => finish(controller.signal.aborted
        ? failure("AbortError: Request aborted")
        : failure(`${error.name}: ${error.message}`)));
      request.end();
    });
  } finally {
    clearTimeout(timer);
    signal?.removeEventListener("abort", abortFromCaller);
  }
}
