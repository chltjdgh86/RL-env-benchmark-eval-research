import { stripVTControlCharacters } from "node:util"
import { parseCapturedCommand, runAndCapture } from "./command-capture.mjs"

function containsBehaviorMarker(output, expected) {
  const lines = stripVTControlCharacters(output).split("\n")
  return lines.some((line, index) => {
    if (!line.includes(expected)) {
      return false
    }
    const previous = lines[index - 1]?.trim() ?? ""
    const next = lines[index + 1]?.trim() ?? ""
    const codeFrame = /^>?\s*\d+\s*\|/.test(line)
    const evalSource = /^\[eval\]:\d+/.test(previous)
    const pointerFollows = /^[\^~]+$/.test(next)
    const stackFrame = /^\s*at\s/.test(line)
    return !codeFrame && !evalSource && !pointerFollows && !stackFrame
  })
}

const argv = process.argv.slice(2)
const mode = argv[0]
const prefixLength = mode === "red" ? 3 : 2
const parsed = parseCapturedCommand(argv, prefixLength)

if (parsed === null || (mode !== "red" && mode !== "green")) {
  console.error(
    "usage: capture-test.mjs red <receipt> <expected> -- <command> [args...] | green <receipt> -- <command> [args...]",
  )
  process.exitCode = 2
} else {
  const receiptPath = parsed.prefix[1]
  const expected = parsed.prefix[2]

  if (receiptPath === undefined) {
    console.error("capture-test receipt path is required")
    process.exitCode = 2
  } else {
    const result = await runAndCapture({
      command: parsed.command,
      args: parsed.args,
      receiptPath,
    })

    if (result.signal !== null) {
      process.exitCode = result.exitCode
    } else if (mode === "green") {
      if (result.exitCode !== 0) {
        console.error(`GREEN_COMMAND_FAILED:${result.exitCode}`)
        process.exitCode = result.exitCode
      }
    } else if (expected === undefined) {
      console.error("RED_EXPECTED_SUBSTRING_REQUIRED")
      process.exitCode = 2
    } else if (result.exitCode === 0) {
      console.error("RED_COMMAND_UNEXPECTEDLY_PASSED")
      process.exitCode = 1
    } else if (!containsBehaviorMarker(result.output, expected)) {
      console.error(`RED_EXPECTED_SUBSTRING_MISSING:${expected}`)
      process.exitCode = 1
    } else {
      console.log(`RED_CAPTURED:${expected}`)
    }
  }
}
