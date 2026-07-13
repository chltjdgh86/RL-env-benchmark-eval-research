#!/usr/bin/env node

import { loadCorpus } from "./corpus-validator.mjs";
import { approvedRedirectOriginsFor, classifyAccessBoundary, classifyRedirect, resolveRedirectLocation } from "./link-audit-policy.mjs";
import { requestPinnedHttps } from "./safe-http.mjs";

const args = process.argv.slice(2);
const readNumberArg = (prefix, fallback) => {
  const value = args.find((arg) => arg.startsWith(`${prefix}=`));
  if (!value) return fallback;
  const number = Number(value.slice(prefix.length + 1));
  return Number.isFinite(number) && number > 0 ? number : fallback;
};
const limit = readNumberArg("--limit", Number.POSITIVE_INFINITY);
const timeoutMs = readNumberArg("--timeout-ms", 15_000);
const concurrency = Math.min(16, readNumberArg("--concurrency", 10));
const strict = args.includes("--strict");
const corpus = loadCorpus();
const sources = corpus.sources.slice(0, limit);

const headerValue = (headers, name) => {
  const value = headers[name];
  return Array.isArray(value) ? value[0] ?? null : value ?? null;
};

const fetchManual = async (initialUrl, method, approvedFinalOrigins) => {
  let url = initialUrl;
  for (let redirects = 0; redirects <= 5; redirects += 1) {
    const response = await requestPinnedHttps(url, {
      method,
      timeoutMs,
      maxBytes: method === "HEAD" ? 0 : 65_536,
      headers: {
        "user-agent": "RLMarketAtlasResearchLinkAudit/1.0 (+static research integrity check)",
        accept: "text/html,application/xhtml+xml,application/pdf;q=0.9,*/*;q=0.5",
        ...(method === "GET" ? { range: "bytes=0-65535" } : {}),
      },
    });
    if (response.error) return { status: response.status, finalUrl: url, body: "", redirects, error: response.error };
    if ([301, 302, 303, 307, 308].includes(response.status)) {
      const location = headerValue(response.headers, "location");
      if (!location) return { status: response.status, finalUrl: url, body: "", redirects, error: "redirect-without-location" };
      if (redirects === 5) return { status: response.status, finalUrl: url, body: "", redirects, error: "redirect-limit-exceeded" };
      const resolved = resolveRedirectLocation(location, url);
      if (resolved.error) return { status: response.status, finalUrl: url, body: "", redirects, error: resolved.error };
      const nextUrl = resolved.url;
      const redirectPolicy = classifyRedirect(initialUrl, nextUrl, { approvedFinalOrigins });
      if (redirectPolicy.unrelatedCrossOrigin) {
        return { status: response.status, finalUrl: nextUrl, body: "", redirects: redirects + 1, error: "blocked-unreviewed-or-unsafe-redirect" };
      }
      url = nextUrl;
      continue;
    }
    return { status: response.status, finalUrl: url, body: response.body.toString("utf8"), redirects, error: null };
  }
  return { status: null, finalUrl: url, body: "", redirects: 5, error: "redirect-limit-exceeded" };
};

const checkOne = async (source) => {
  const approvedFinalOrigins = approvedRedirectOriginsFor(source.sourceId);
  let result = await fetchManual(source.canonicalUrl, "HEAD", approvedFinalOrigins);
  if (!["blocked-unreviewed-or-unsafe-redirect", "invalid-redirect-location", "redirect-limit-exceeded", "redirect-without-location"].includes(result.error)) {
    result = await fetchManual(source.canonicalUrl, "GET", approvedFinalOrigins);
  }
  const redirect = classifyRedirect(source.canonicalUrl, result.finalUrl, { approvedFinalOrigins });
  const derivedAccess = redirect.unrelatedCrossOrigin
    ? "unavailable"
    : result.error
    ? "unavailable"
    : classifyAccessBoundary(result.status, result.body, result.finalUrl);
  return {
    sourceId: source.sourceId,
    canonicalUrl: source.canonicalUrl,
    storedAccess: source.access,
    derivedAccess,
    status: result.status,
    redirects: result.redirects,
    finalUrl: result.finalUrl,
    rawResult: result.error ?? `HTTP ${result.status}`,
    crossOriginRedirect: redirect.crossOrigin,
    unrelatedCrossOriginRedirect: redirect.unrelatedCrossOrigin,
    advisory: derivedAccess !== source.access || redirect.unrelatedCrossOrigin,
  };
};

const results = new Array(sources.length);
let cursor = 0;
const worker = async () => {
  while (cursor < sources.length) {
    const index = cursor;
    cursor += 1;
    results[index] = await checkOne(sources[index]);
  }
};
await Promise.all(Array.from({ length: Math.min(concurrency, sources.length) }, () => worker()));

const summary = {
  runAt: new Date().toISOString(),
  cutoffAt: "2026-07-11",
  policy: { timeoutMs, maxRedirects: 5, headThenGetFallback: true, controlsBypassed: false },
  checked: results.length,
  reachable: results.filter((result) => result.derivedAccess !== "unavailable").length,
  unavailable: results.filter((result) => result.derivedAccess === "unavailable").length,
  advisoryMismatches: results.filter((result) => result.advisory).length,
  unrelatedRedirects: results.filter((result) => result.unrelatedCrossOriginRedirect).length,
  results,
};
process.stdout.write(`${JSON.stringify(summary, null, 2)}\n`);

if (strict && summary.unavailable > 0) process.exitCode = 1;
