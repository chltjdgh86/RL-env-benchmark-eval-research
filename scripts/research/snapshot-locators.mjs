#!/usr/bin/env node

import { writeFileSync } from "node:fs";
import { join } from "node:path";

import { DEFAULT_ROOT, loadCorpus } from "./corpus-validator.mjs";
import { approvedRedirectOriginsFor, classifyRedirect, resolveRedirectLocation } from "./link-audit-policy.mjs";
import { decodeHtmlEntities } from "./render-utils.mjs";
import { requestPinnedHttps } from "./safe-http.mjs";

const CUTOFF = "2026-07-11";
const TIMEOUT_MS = 15_000;
const MAX_REDIRECTS = 5;
const CONCURRENCY = 12;
const corpus = loadCorpus(DEFAULT_ROOT);
const outputPath = join(DEFAULT_ROOT, "research/migrations/source-locator-snapshots.json");

const needles = {
  src_s04: "13.80 billion",
  src_s06: "2 billion",
  src_s07: "below $1 billion",
  src_s11: "2 million a day",
  src_s12: "contractor",
  src_s13: "will acquire",
  src_s14: "data breach",
  src_s15: "$35 million",
  src_s22: "1,000",
  src_s27: "$30 million",
  src_s32: "$43 million",
  src_s33: "$43 million",
  src_s37: "$100",
  src_s54: "assurance",
  src_s67: "40%",
};
const cleanText = (value) =>
  decodeHtmlEntities(value)
      .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, " ")
      .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, " ")
      .replace(/<svg\b[^>]*>[\s\S]*?<\/svg>/gi, " ")
      .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const firstMatch = (html, pattern) => {
  const match = html.match(pattern);
  return match ? cleanText(match[1]) : "";
};

const quoteAtMost25Words = (value) => {
  const words = value.trim().split(/\s+/).filter(Boolean);
  return words.slice(0, 25).join(" ");
};

const contextAroundNeedle = (text, needle) => {
  const lower = text.toLowerCase();
  const index = lower.indexOf(needle.toLowerCase());
  if (index < 0) return null;
  const before = text.slice(0, index).trim().split(/\s+/).slice(-7);
  const atAndAfter = text.slice(index).trim().split(/\s+/).slice(0, 18);
  return [...before, ...atAndAfter].slice(0, 25).join(" ");
};

const fetchWithPolicy = async (initialUrl, sourceId) => {
  const approvedFinalOrigins = approvedRedirectOriginsFor(sourceId);
  let url = initialUrl;
  for (let redirects = 0; redirects <= MAX_REDIRECTS; redirects += 1) {
    const response = await requestPinnedHttps(url, {
      method: "GET",
      timeoutMs: TIMEOUT_MS,
      maxBytes: 25 * 1024 * 1024,
      headers: {
        "user-agent": "RLMarketAtlasResearchLocatorCapture/1.0 (+static evidence locator audit)",
        accept: "text/html,application/xhtml+xml,application/pdf;q=0.9,*/*;q=0.5",
      },
    });
    const contentTypeHeader = response.headers["content-type"];
    const contentType = (Array.isArray(contentTypeHeader) ? contentTypeHeader[0] : contentTypeHeader) ?? "unknown";
    if (response.error || response.truncated) {
      return { status: response.status, finalUrl: url, contentType, body: null, binary: null, error: response.error ?? "response-body-limit-exceeded" };
    }
    if ([301, 302, 303, 307, 308].includes(response.status)) {
      const locationHeader = response.headers.location;
      const location = Array.isArray(locationHeader) ? locationHeader[0] : locationHeader;
      if (!location || redirects === MAX_REDIRECTS) {
        return { status: response.status, finalUrl: url, contentType, body: null, binary: null, error: location ? "redirect-limit-exceeded" : "redirect-without-location" };
      }
      const resolved = resolveRedirectLocation(location, url);
      if (resolved.error) return { status: response.status, finalUrl: url, contentType, body: null, binary: null, error: resolved.error };
      const nextUrl = resolved.url;
      const redirectPolicy = classifyRedirect(initialUrl, nextUrl, { approvedFinalOrigins });
      if (redirectPolicy.unrelatedCrossOrigin) {
        return { status: response.status, finalUrl: nextUrl, contentType, body: null, binary: null, error: "blocked-unreviewed-or-unsafe-redirect" };
      }
      url = nextUrl;
      continue;
    }
    const isText = contentType.includes("html") || contentType.includes("text");
    const body = isText ? response.body.toString("utf8") : null;
    return { status: response.status, finalUrl: url, contentType, body, binary: null, error: null };
  }
  return { status: null, finalUrl: url, contentType: "unknown", body: null, binary: null, error: "redirect-limit-exceeded" };
};

const locate = (source, fetched) => {
  const statusMetadata = fetched.error ?? `HTTP ${fetched.status} · ${fetched.contentType.split(";")[0]}`;
  if (!fetched.body) {
    return {
      locator: { kind: "page", value: `Document URL — ${fetched.finalUrl}` },
      excerpt: quoteAtMost25Words(statusMetadata),
      captureMethod: "transport-metadata",
    };
  }
  const title = firstMatch(fetched.body, /<title\b[^>]*>([\s\S]*?)<\/title>/i);
  const h1 = firstMatch(fetched.body, /<h1\b[^>]*>([\s\S]*?)<\/h1>/i);
  const h2 = firstMatch(fetched.body, /<h2\b[^>]*>([\s\S]*?)<\/h2>/i);
  const pageText = cleanText(fetched.body);
  const needle = needles[source.sourceId];
  const exactContext = needle ? contextAroundNeedle(pageText, needle) : null;
  if (exactContext) {
    return {
      locator: { kind: "paragraph", value: `Visible text containing “${needle}” — ${fetched.finalUrl}` },
      excerpt: quoteAtMost25Words(exactContext),
      captureMethod: "visible-text-needle",
    };
  }
  if (h1) {
    return {
      locator: { kind: "html_heading", value: `H1 — ${h1}` },
      excerpt: quoteAtMost25Words(h1),
      captureMethod: "html-h1",
    };
  }
  if (h2) {
    return {
      locator: { kind: "html_heading", value: `H2 — ${h2}` },
      excerpt: quoteAtMost25Words(h2),
      captureMethod: "html-h2",
    };
  }
  if (title) {
    return {
      locator: { kind: "page", value: `<title> — ${title}` },
      excerpt: quoteAtMost25Words(title),
      captureMethod: "html-title",
    };
  }
  return {
    locator: { kind: "page", value: `Page URL — ${fetched.finalUrl}` },
    excerpt: quoteAtMost25Words(statusMetadata),
    captureMethod: "transport-metadata-no-readable-heading",
  };
};

const entries = new Array(corpus.sources.length);
let cursor = 0;
const worker = async () => {
  while (cursor < corpus.sources.length) {
    const index = cursor;
    cursor += 1;
    const source = corpus.sources[index];
    const fetched = await fetchWithPolicy(source.canonicalUrl, source.sourceId);
    const located = locate(source, fetched);
    entries[index] = {
      sourceId: source.sourceId,
      canonicalUrl: source.canonicalUrl,
      status: fetched.status,
      finalUrl: fetched.finalUrl,
      contentType: fetched.contentType,
      locator: located.locator,
      excerpt: located.excerpt,
      captureMethod: located.captureMethod,
      observerGroup: source.sourceId.startsWith("src_adj-")
        ? "bounded-adjacent-census-locator-capture"
        : "canonical-source-locator-capture",
    };
  }
};
await Promise.all(Array.from({ length: CONCURRENCY }, () => worker()));

const snapshot = {
  version: 1,
  capturedAt: CUTOFF,
  policy: {
    timeoutMs: TIMEOUT_MS,
    maxRedirects: MAX_REDIRECTS,
    controlsBypassed: false,
    excerptWordLimit: 25,
  },
  entries,
};
writeFileSync(outputPath, `${JSON.stringify(snapshot, null, 2)}\n`, "utf8");
console.log(`LOCATOR_SNAPSHOT_WRITTEN entries=${entries.length} path=${outputPath}`);
