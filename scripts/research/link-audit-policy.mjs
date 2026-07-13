import { lookup as dnsLookup } from "node:dns/promises";
import { isIP } from "node:net";

const normalizeHost = (value) => value.toLowerCase().replace(/^\[|\]$/g, "").replace(/\.$/, "");
const hostnameFromUrl = (url) => normalizeHost(new URL(url).hostname);
const normalizedHostname = (url) => hostnameFromUrl(url).replace(/^www\./, "");
const normalizedOrigin = (url) => {
  const parsed = new URL(url);
  return `${parsed.protocol}//${normalizedHostname(url)}${parsed.port ? `:${parsed.port}` : ""}`;
};

export const isUnsafeHostname = (value) => {
  const host = normalizeHost(value);
  if (host === "localhost" || host.endsWith(".localhost") || host.endsWith(".local") || host.endsWith(".internal") || host.endsWith(".home.arpa")) return true;
  if (isIP(host) === 6) {
    const hextets = host.split(":");
    const firstHextet = Number.parseInt(hextets[0] || "0", 16);
    const secondHextet = Number.parseInt(hextets[1] || "0", 16);
    const globalUnicast = firstHextet >= 0x2000 && firstHextet <= 0x3fff;
    return !globalUnicast || host.startsWith("2002:") ||
      (firstHextet === 0x2001 && (secondHextet <= 0x01ff || secondHextet === 0x0db8)) ||
      (firstHextet === 0x3fff && secondHextet <= 0x0fff);
  }
  const octets = host.split(".").map(Number);
  if (octets.length !== 4 || octets.some((octet) => !Number.isInteger(octet) || octet < 0 || octet > 255)) return false;
  return octets[0] === 0 || octets[0] === 10 ||
    (octets[0] === 100 && octets[1] >= 64 && octets[1] <= 127) || octets[0] === 127 ||
    (octets[0] === 169 && octets[1] === 254) ||
    (octets[0] === 172 && octets[1] >= 16 && octets[1] <= 31) ||
    (octets[0] === 192 && ((octets[1] === 0 && [0, 2].includes(octets[2])) ||
      (octets[1] === 31 && octets[2] === 196) ||
      (octets[1] === 52 && octets[2] === 193) ||
      (octets[1] === 88 && octets[2] === 99) ||
      octets[1] === 168 ||
      (octets[1] === 175 && octets[2] === 48))) ||
    (octets[0] === 198 && (octets[1] === 18 || octets[1] === 19 || (octets[1] === 51 && octets[2] === 100))) ||
    (octets[0] === 203 && octets[1] === 0 && octets[2] === 113) || octets[0] >= 224;
};

export const REVIEWED_REDIRECT_ORIGINS = Object.freeze({
  "src_adj-imerit": ["https://imerit.ai"],
  "src_adj-invisible-technologies": ["https://invisibletech.ai"],
  "src_adj-catalant": ["https://catalant.com"],
  "src_adj-kernel": ["https://kernel.sh"],
  "src_adj-glg": ["https://glg.com"],
});

export const approvedRedirectOriginsFor = (sourceId) => REVIEWED_REDIRECT_ORIGINS[sourceId] ?? [];

export function classifyAccessBoundary(status, body, url) {
  const text = String(body).toLowerCase();
  if (status === 401 || /authentication required|you must (?:sign|log) in|please (?:sign|log) in to|access your account/.test(text) ||
    (/<title[^>]*>[^<]*(?:sign|log) in/.test(text) && /type=["']password["']/.test(text))) return "login_gated";
  if (status === 402 || /subscribe to continue|subscription required|subscriber-only|already a subscriber\?|paywall/.test(text)) return "paywalled";
  if (url.includes("web.archive.org")) return "archived";
  if (status >= 200 && status < 400) return "open";
  return "unavailable";
}

export function resolveRedirectLocation(location, currentUrl) {
  try {
    return { url: new URL(location, currentUrl).href, error: null };
  } catch {
    return { url: null, error: "invalid-redirect-location" };
  }
}

export function classifyUrlTarget(url) {
  try {
    const parsed = new URL(url);
    const host = hostnameFromUrl(url);
    const unsafeTarget = parsed.protocol !== "https:" || parsed.username !== "" || parsed.password !== "" || isUnsafeHostname(host);
    return {
      unsafeTarget,
      reason: unsafeTarget ? "unsafe-url-target" : null,
      host,
      comparisonHost: host.replace(/^www\./, ""),
    };
  } catch {
    return { unsafeTarget: true, reason: "invalid-url-target", host: null, comparisonHost: null };
  }
}

export async function classifyNetworkTarget(url, lookupFn = dnsLookup) {
  const target = classifyUrlTarget(url);
  if (target.unsafeTarget || target.host === null || isIP(target.host) !== 0) return { ...target, addresses: target.host === null ? [] : [target.host] };
  try {
    const records = await lookupFn(target.host, { all: true, verbatim: true });
    const addresses = records.map((record) => record.address);
    const unsafeTarget = addresses.length === 0 || addresses.some(isUnsafeHostname);
    return {
      ...target,
      unsafeTarget,
      reason: unsafeTarget ? "private-or-unresolved-network-target" : null,
      addresses,
    };
  } catch {
    return { ...target, unsafeTarget: true, reason: "dns-lookup-failed", addresses: [] };
  }
}

export function classifyRedirect(initialUrl, finalUrl, { approvedFinalOrigins = [] } = {}) {
  const initialTarget = classifyUrlTarget(initialUrl);
  const finalTarget = classifyUrlTarget(finalUrl);
  const initialHost = initialTarget.comparisonHost;
  const finalHost = finalTarget.comparisonHost;
  const unsafeTarget = finalTarget.unsafeTarget;
  const sameSite = initialHost !== null && finalHost !== null && normalizedOrigin(initialUrl) === normalizedOrigin(finalUrl);
  const approved = !unsafeTarget && approvedFinalOrigins.map(normalizedOrigin).includes(normalizedOrigin(finalUrl));
  const crossOrigin = !sameSite;
  return {
    crossOrigin,
    unrelatedCrossOrigin: unsafeTarget || (crossOrigin && !approved),
    unsafeTarget,
    approved,
    initialHost,
    finalHost,
  };
}
