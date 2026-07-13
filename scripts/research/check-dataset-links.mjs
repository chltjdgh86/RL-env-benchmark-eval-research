#!/usr/bin/env node

import { readFileSync } from "node:fs"
import { dirname, resolve } from "node:path"
import { fileURLToPath, pathToFileURL } from "node:url"

import {
  classifyRedirect,
  classifyUrlTarget,
  resolveRedirectLocation,
} from "./link-audit-policy.mjs"
import { requestPinnedHttps } from "./safe-http.mjs"

const SCRIPT_DIR = dirname(fileURLToPath(import.meta.url))
const DEFAULT_CORPUS = resolve(SCRIPT_DIR, "../../research/corpus/datasets.json")
const REQUIRED_SEEDS = [
  "https://www.mercor.com/apex/apex-agents-leaderboard/",
  "https://huggingface.co/datasets/mercor/apex-agents",
  "https://huggingface.co/datasets/openai/gdpval/viewer/default/train",
  "https://www.aviro.ai/benchmarks/c4/samples",
]
const DISALLOWED_MIRRORS = [
  "https://huggingface.co/datasets/benchflow/skillsbench",
  "https://huggingface.co/datasets/harborframework/terminal-bench-2.0",
  "https://huggingface.co/datasets/markov-ai/apex-agents",
]
const REVIEWED_DATASET_REDIRECT_ORIGINS = Object.freeze({
  "doi.org": ["https://zenodo.org"],
})
const MAX_REDIRECTS = 5

const normalizeUrl = (value) => {
  const url = new URL(value)
  url.hash = ""
  url.hostname = url.hostname.toLowerCase()
  if (url.pathname.length > 1) url.pathname = url.pathname.replace(/\/+$/u, "")
  url.searchParams.sort()
  return url.href
}

const flattenSurfaces = (corpus) => {
  if (corpus === null || typeof corpus !== "object" || !Array.isArray(corpus.families)) return []
  return corpus.families.flatMap((family) =>
    family !== null && typeof family === "object" && Array.isArray(family.surfaces)
      ? family.surfaces
      : [],
  )
}

export function auditDatasetLinks(corpus) {
  const errors = []
  const surfaces = flattenSurfaces(corpus)
  const normalized = new Map()
  const rawUrls = new Set()
  for (const [index, surface] of surfaces.entries()) {
    const value = surface !== null && typeof surface === "object" ? surface.url : null
    if (typeof value !== "string") {
      errors.push({ code: "DATASET_LINK_URL", detail: `surface[${index}] missing URL` })
      continue
    }
    rawUrls.add(value)
    let canonical
    try {
      canonical = normalizeUrl(value)
    } catch {
      errors.push({ code: "DATASET_LINK_URL", detail: value })
      continue
    }
    const target = classifyUrlTarget(value)
    if (!value.startsWith("https://") || target.unsafeTarget) {
      errors.push({ code: "DATASET_LINK_HTTPS", detail: value })
    }
    const existing = normalized.get(canonical)
    if (existing !== undefined) {
      errors.push({ code: "DATASET_LINK_DUPLICATE", detail: `${existing} <> ${value}` })
    } else {
      normalized.set(canonical, value)
    }
  }
  for (const required of REQUIRED_SEEDS) {
    if (!rawUrls.has(required)) errors.push({ code: "DATASET_LINK_REQUIRED_SEED", detail: required })
  }
  for (const mirror of DISALLOWED_MIRRORS) {
    if (normalized.has(normalizeUrl(mirror))) {
      errors.push({ code: "DATASET_LINK_DISALLOWED_MIRROR", detail: mirror })
    }
  }
  return { errors, urls: [...rawUrls].sort() }
}

export const classifyDatasetAvailability = (response) => {
  if (response.error !== null) return "network_error"
  if (response.status === 401) return "login_gate"
  if (response.status === 402) return "commercial_gate"
  if (response.status === 403 || response.status === 429) return "waf_or_rate_limit"
  if (response.status === 404 || response.status === 410) return "not_found"
  if (response.status !== null && response.status >= 500) return "server_error"
  if (response.status !== null && response.status >= 400) return "client_error"
  if (response.status !== null && response.status >= 300) return "redirect"
  if (response.status !== null && response.status >= 200) return "reachable"
  return "network_error"
}

export const isStrictAvailabilityFailure = (availability) =>
  ["client_error", "network_error", "not_found", "server_error", "unsafe_redirect"].includes(
    availability,
  )

const locationHeader = (headers) => {
  const value = headers?.location
  return Array.isArray(value) ? value[0] : value
}

export function classifyDatasetRedirect(initialUrl, response) {
  const availability = classifyDatasetAvailability(response)
  if (availability !== "redirect") return { availability, detail: response.error }
  const location = locationHeader(response.headers)
  if (typeof location !== "string" || location.trim() === "") {
    return { availability: "unsafe_redirect", detail: "Redirect response omitted Location" }
  }
  const resolved = resolveRedirectLocation(location, initialUrl)
  if (resolved.url === null) {
    return { availability: "unsafe_redirect", detail: resolved.error }
  }
  const initialHost = new URL(initialUrl).hostname.toLowerCase().replace(/^www\./u, "")
  const redirect = classifyRedirect(initialUrl, resolved.url, {
    approvedFinalOrigins: REVIEWED_DATASET_REDIRECT_ORIGINS[initialHost] ?? [],
  })
  if (redirect.unrelatedCrossOrigin) {
    return {
      availability: "unsafe_redirect",
      detail: `Rejected redirect target ${resolved.url}`,
    }
  }
  return { availability: "redirect", detail: resolved.url }
}

const timeoutResult = (url, timeoutMs) => ({
  url,
  status: null,
  availability: "network_error",
  detail: `TimeoutError: Availability check timed out after ${timeoutMs}ms`,
})

const requestWithinDeadline = (request, timeoutMs, controller, fallback) =>
  new Promise((resolveRequest) => {
    let settled = false
    const finish = (response) => {
      if (settled) return
      settled = true
      clearTimeout(timer)
      resolveRequest(response)
    }
    const timer = setTimeout(() => {
      controller.abort(Object.assign(new Error(`Availability check timed out after ${timeoutMs}ms`), { name: "TimeoutError" }))
      finish(fallback)
    }, timeoutMs)
    Promise.resolve()
      .then(request)
      .then(finish, (error) =>
        finish({ ...fallback, detail: error instanceof Error ? `${error.name}: ${error.message}` : String(error) }),
      )
  })

export async function checkDatasetUrl(url, timeoutMs, requester = requestPinnedHttps) {
  const controller = new AbortController()
  const fallback = timeoutResult(url, timeoutMs)
  return requestWithinDeadline(
    async () => {
      let currentUrl = url
      let redirected = false
      const visited = new Set([url])
      for (let hop = 0; hop <= MAX_REDIRECTS; hop += 1) {
        let response = await requester(currentUrl, {
          method: "HEAD",
          timeoutMs,
          maxBytes: 0,
          headers: { "user-agent": "RLMarketAtlasDatasetAudit/1.0" },
          signal: controller.signal,
        })
        if (controller.signal.aborted) return fallback
        if (response.error === null && response.status === 405) {
          response = await requester(currentUrl, {
            method: "GET",
            timeoutMs,
            maxBytes: 1,
            headers: {
              "user-agent": "RLMarketAtlasDatasetAudit/1.0",
              range: "bytes=0-0",
            },
            signal: controller.signal,
          })
          if (controller.signal.aborted) return fallback
        }
        const classification = classifyDatasetRedirect(currentUrl, response)
        if (classification.availability !== "redirect") {
          return {
            url,
            status: response.status,
            availability:
              redirected && classification.availability === "reachable"
                ? "redirect"
                : classification.availability,
            detail: redirected && classification.availability === "reachable"
              ? currentUrl
              : classification.detail,
          }
        }
        const target = classification.detail
        if (typeof target !== "string" || hop === MAX_REDIRECTS || visited.has(target)) {
          return {
            url,
            status: response.status,
            availability: "unsafe_redirect",
            detail: hop === MAX_REDIRECTS ? "Redirect limit exceeded" : "Redirect cycle detected",
          }
        }
        redirected = true
        visited.add(target)
        currentUrl = target
      }
      return fallback
    },
    timeoutMs,
    controller,
    fallback,
  )
}

export async function checkDatasetAvailability(urls, options) {
  for (const name of ["limit", "timeoutMs", "concurrency"]) {
    const value = options?.[name]
    if (!Number.isSafeInteger(value) || value <= 0) {
      throw new Error(`DATASET_LINK_ARGUMENT: ${name} must be a positive integer`)
    }
  }
  const selected = urls.slice(0, options.limit)
  const concurrency = Math.min(16, options.concurrency)
  const results = new Array(selected.length)
  let cursor = 0
  const worker = async () => {
    while (cursor < selected.length) {
      const index = cursor
      cursor += 1
      const url = selected[index]
      if (url !== undefined) results[index] = await checkDatasetUrl(url, options.timeoutMs)
    }
  }
  await Promise.all(
    Array.from({ length: Math.min(concurrency, selected.length) }, () => worker()),
  )
  const counts = Object.fromEntries(
    [...new Set(results.map((result) => result.availability))]
      .sort()
      .map((kind) => [kind, results.filter((result) => result.availability === kind).length]),
  )
  return {
    checked: results.length,
    total: urls.length,
    timeoutMs: options.timeoutMs,
    concurrency,
    counts,
    exceptions: results.filter((result) => result.availability !== "reachable"),
  }
}

const numberArgument = (arguments_, name, fallback) => {
  const index = arguments_.indexOf(name)
  if (index < 0) return fallback
  const raw = arguments_[index + 1]
  if (raw === undefined || !/^[1-9]\d*$/u.test(raw)) {
    throw new Error(`DATASET_LINK_ARGUMENT: ${name} must be a positive integer`)
  }
  const value = Number(raw)
  if (!Number.isSafeInteger(value)) {
    throw new Error(`DATASET_LINK_ARGUMENT: ${name} exceeds the safe integer range`)
  }
  return value
}

async function main() {
  const arguments_ = process.argv.slice(2)
  const corpusIndex = arguments_.indexOf("--corpus")
  const corpusPath =
    corpusIndex < 0 ? DEFAULT_CORPUS : resolve(arguments_[corpusIndex + 1] ?? DEFAULT_CORPUS)
  const corpus = JSON.parse(readFileSync(corpusPath, "utf8"))
  const audit = auditDatasetLinks(corpus)
  if (audit.errors.length > 0) {
    for (const error of audit.errors) process.stderr.write(`${error.code}: ${error.detail}\n`)
    process.exitCode = 1
    return
  }
  const options = {
    limit: numberArgument(arguments_, "--limit", audit.urls.length),
    timeoutMs: numberArgument(arguments_, "--timeout-ms", 8_000),
    concurrency: Math.min(16, numberArgument(arguments_, "--concurrency", 12)),
  }
  if (arguments_.includes("--offline")) {
    process.stdout.write(`DATASET_LINKS_OFFLINE_OK surfaces=${audit.urls.length}\n`)
    return
  }
  const summary = await checkDatasetAvailability(audit.urls, options)
  process.stdout.write(`${JSON.stringify(summary, null, 2)}\n`)
  if (
    arguments_.includes("--strict-live") &&
    summary.exceptions.some((result) => isStrictAvailabilityFailure(result.availability))
  ) {
    process.exitCode = 1
  }
}

if (import.meta.url === pathToFileURL(process.argv[1] ?? "").href) {
  try {
    await main()
  } catch (error) {
    if (error instanceof Error) {
      process.stderr.write(`${error.message}\n`)
      process.exitCode = 1
    } else {
      throw error
    }
  }
}
