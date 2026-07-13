import { existsSync, readdirSync, readFileSync, statSync } from "node:fs"
import { extname, join, resolve } from "node:path"
import { createScanner, LanguageVariant, SyntaxKind } from "typescript/unstable/ast"

const includedExtensions = new Set([".ts", ".tsx", ".mts", ".cts"])
const ignoredDirectories = new Set([
  ".git",
  ".next",
  ".nuxt",
  ".turbo",
  "build",
  "coverage",
  "dist",
  "node_modules",
])

function isTypeScriptFile(path) {
  return includedExtensions.has(extname(path).toLowerCase()) && !path.endsWith(".d.ts")
}

export function discoverTypeScriptFiles(inputs) {
  const files = []
  const walk = (path) => {
    if (!existsSync(path)) {
      throw new RangeError(`Path does not exist: ${path}`)
    }
    if (statSync(path).isFile()) {
      if (isTypeScriptFile(path)) {
        files.push(path)
      }
      return
    }
    for (const entry of readdirSync(path, { withFileTypes: true })) {
      if (entry.isDirectory()) {
        if (!ignoredDirectories.has(entry.name)) {
          walk(join(path, entry.name))
        }
      } else if (isTypeScriptFile(entry.name)) {
        files.push(join(path, entry.name))
      }
    }
  }
  for (const input of inputs) {
    walk(resolve(input))
  }
  return [...new Set(files)].sort()
}

export function loadTypeScriptSource(file) {
  const source = readFileSync(file, "utf8")
  const scanner = createScanner(true, LanguageVariant.JSX, source)
  const tokens = []
  const templateBraceDepths = []
  let kind = scanner.scan()
  while (kind !== SyntaxKind.EndOfFile) {
    if (kind === SyntaxKind.TemplateHead) {
      templateBraceDepths.push(0)
    } else if (templateBraceDepths.length > 0 && kind === SyntaxKind.OpenBraceToken) {
      const index = templateBraceDepths.length - 1
      templateBraceDepths[index] += 1
    } else if (templateBraceDepths.length > 0 && kind === SyntaxKind.CloseBraceToken) {
      const index = templateBraceDepths.length - 1
      if (templateBraceDepths[index] === 0) {
        kind = scanner.reScanTemplateToken(false)
        if (kind === SyntaxKind.TemplateTail) {
          templateBraceDepths.pop()
        }
      } else {
        templateBraceDepths[index] -= 1
      }
    }
    tokens.push({
      kind,
      text: scanner.getTokenText(),
      start: scanner.getTokenStart(),
    })
    kind = scanner.scan()
  }
  return { source, tokens }
}

export function sourceLine(source, position) {
  const start = source.lastIndexOf("\n", position - 1) + 1
  const end = source.indexOf("\n", position)
  return source.slice(start, end === -1 ? source.length : end)
}

export function formatViolation(rule, file, source, token) {
  const before = source.slice(0, token.start)
  const line = before.split("\n").length
  const lastLineBreak = before.lastIndexOf("\n")
  const column = token.start - lastLineBreak
  return `${rule}:${file}:${line}:${column}`
}

export function findClosingBrace(tokens, openIndex) {
  let depth = 0
  for (let index = openIndex; index < tokens.length; index += 1) {
    const token = tokens[index]
    if (token?.kind === SyntaxKind.OpenBraceToken) {
      depth += 1
    } else if (token?.kind === SyntaxKind.CloseBraceToken) {
      depth -= 1
      if (depth === 0) {
        return index
      }
    }
  }
  return null
}
