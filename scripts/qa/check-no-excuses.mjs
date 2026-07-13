import { SyntaxKind } from "typescript/unstable/ast"
import {
  discoverTypeScriptFiles,
  findClosingBrace,
  formatViolation,
  loadTypeScriptSource,
  sourceLine,
} from "./no-excuses-source.mjs"

function analyzeCatch(tokens, catchIndex, file, source) {
  const violations = []
  const catchToken = tokens[catchIndex]
  if (
    catchToken === undefined ||
    sourceLine(source, catchToken.start).includes("no-excuse-ok: catch")
  ) {
    return violations
  }

  let cursor = catchIndex + 1
  let errorName = null
  if (tokens[cursor]?.kind === SyntaxKind.OpenParenToken) {
    const errorToken = tokens[cursor + 1]
    errorName = errorToken?.kind === SyntaxKind.Identifier ? errorToken.text : null
    while (cursor < tokens.length && tokens[cursor]?.kind !== SyntaxKind.CloseParenToken) {
      cursor += 1
    }
    cursor += 1
  }
  if (tokens[cursor]?.kind !== SyntaxKind.OpenBraceToken) {
    return violations
  }
  const closeIndex = findClosingBrace(tokens, cursor)
  if (closeIndex === null) {
    return violations
  }
  const body = tokens.slice(cursor + 1, closeIndex)
  if (body.length === 0) {
    violations.push(formatViolation("EMPTY_CATCH", file, source, catchToken))
    return violations
  }
  const narrowed =
    errorName !== null &&
    body.some(
      (token, index) =>
        token.text === errorName && body[index + 1]?.kind === SyntaxKind.InstanceOfKeyword,
    )
  const rethrown = body.some(
    (token, index) =>
      token.kind === SyntaxKind.ThrowKeyword &&
      ((errorName !== null && body[index + 1]?.text === errorName) ||
        body[index + 1]?.kind === SyntaxKind.NewKeyword),
  )
  if (!narrowed && !rethrown) {
    violations.push(formatViolation("CATCH_WITHOUT_NARROWING", file, source, catchToken))
  }
  return violations
}

function isImportOrExportAlias(tokens, index) {
  if (tokens[index - 1]?.kind === SyntaxKind.AsteriskToken) {
    return true
  }
  const boundaryKinds = new Set([
    SyntaxKind.EqualsToken,
    SyntaxKind.ConstKeyword,
    SyntaxKind.LetKeyword,
    SyntaxKind.VarKeyword,
    SyntaxKind.ReturnKeyword,
    SyntaxKind.SemicolonToken,
  ])
  for (let cursor = index - 1; cursor >= 0; cursor -= 1) {
    const kind = tokens[cursor]?.kind
    if (kind === SyntaxKind.ImportKeyword || kind === SyntaxKind.ExportKeyword) {
      return true
    }
    if (kind !== undefined && boundaryKinds.has(kind)) {
      return false
    }
  }
  return false
}

const expressionEndKinds = new Set([
  SyntaxKind.Identifier,
  SyntaxKind.ThisKeyword,
  SyntaxKind.SuperKeyword,
  SyntaxKind.StringLiteral,
  SyntaxKind.NumericLiteral,
  SyntaxKind.BigIntLiteral,
  SyntaxKind.TrueKeyword,
  SyntaxKind.FalseKeyword,
  SyntaxKind.NullKeyword,
  SyntaxKind.CloseParenToken,
  SyntaxKind.CloseBracketToken,
])
const literalKinds = new Set([
  SyntaxKind.StringLiteral,
  SyntaxKind.NumericLiteral,
  SyntaxKind.BigIntLiteral,
  SyntaxKind.TrueKeyword,
  SyntaxKind.FalseKeyword,
  SyntaxKind.NullKeyword,
  SyntaxKind.NoSubstitutionTemplateLiteral,
  SyntaxKind.TemplateHead,
])

function analyzeFile(file) {
  const { source, tokens } = loadTypeScriptSource(file)
  const violations = []
  const add = (rule, token) => violations.push(formatViolation(rule, file, source, token))

  for (let index = 0; index < tokens.length; index += 1) {
    const token = tokens[index]
    if (token === undefined) {
      continue
    }
    const previous = tokens[index - 1]
    const next = tokens[index + 1]
    if (token.kind === SyntaxKind.AsKeyword) {
      if (next?.kind === SyntaxKind.AnyKeyword) {
        add("NO_AS_ANY", token)
      } else if (next?.kind === SyntaxKind.UnknownKeyword) {
        add("NO_AS_UNKNOWN", token)
      } else if (next?.kind !== SyntaxKind.ConstKeyword && !isImportOrExportAlias(tokens, index)) {
        add("NO_TYPE_ASSERTION", token)
      }
    }
    if (
      token.kind === SyntaxKind.AnyKeyword &&
      previous?.kind !== SyntaxKind.AsKeyword &&
      previous?.kind !== SyntaxKind.DotToken &&
      previous?.kind !== SyntaxKind.QuestionDotToken
    ) {
      if (!sourceLine(source, token.start).includes("no-excuse-ok: any")) {
        add("NO_EXPLICIT_ANY", token)
      }
    }
    if (
      token.kind === SyntaxKind.EnumKeyword &&
      previous?.kind !== SyntaxKind.DotToken &&
      previous?.kind !== SyntaxKind.QuestionDotToken
    ) {
      add("NO_ENUM", token)
    }
    if (
      token.kind === SyntaxKind.ExclamationToken &&
      previous !== undefined &&
      expressionEndKinds.has(previous.kind)
    ) {
      add("NO_NON_NULL_ASSERTION", token)
    }
    if (
      token.kind === SyntaxKind.ThrowKeyword &&
      next !== undefined &&
      literalKinds.has(next.kind)
    ) {
      add("NO_LITERAL_THROW", token)
    }
    if (
      token.kind === SyntaxKind.ExportKeyword &&
      (next?.kind === SyntaxKind.LetKeyword || next?.kind === SyntaxKind.VarKeyword)
    ) {
      add("NO_MUTABLE_EXPORT", token)
    }
    if (
      token.kind === SyntaxKind.ExportKeyword &&
      next?.kind === SyntaxKind.DeclareKeyword &&
      (tokens[index + 2]?.kind === SyntaxKind.LetKeyword ||
        tokens[index + 2]?.kind === SyntaxKind.VarKeyword)
    ) {
      add("NO_MUTABLE_EXPORT", token)
    }
    if (token.kind === SyntaxKind.CatchKeyword) {
      violations.push(...analyzeCatch(tokens, index, file, source))
    }
  }

  for (const match of source.matchAll(/\/\/\s*@ts-(ignore|expect-error|nocheck)/g)) {
    const rule =
      match[1] === "ignore"
        ? "NO_TS_IGNORE"
        : match[1] === "expect-error"
          ? "NO_TS_EXPECT_ERROR"
          : "NO_TS_NOCHECK"
    violations.push(`${rule}:${file}`)
  }
  return violations
}
const inputs = process.argv.length > 2 ? process.argv.slice(2) : [process.cwd()]
const files = discoverTypeScriptFiles(inputs)
const violations = files.flatMap(analyzeFile)

if (files.length === 0) {
  console.error("NO_TYPESCRIPT_FILES_FOUND")
  process.exitCode = 2
} else if (violations.length > 0) {
  for (const violation of [...new Set(violations)].sort()) {
    console.error(violation)
  }
  process.exitCode = 1
} else {
  console.log(`NO_EXCUSES_OK:${files.length}`)
}
