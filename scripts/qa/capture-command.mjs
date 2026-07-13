import { parseCapturedCommand, runAndCapture } from "./command-capture.mjs"

const parsed = parseCapturedCommand(process.argv.slice(2), 2)

if (parsed === null || parsed.prefix[0] !== "run" || parsed.prefix[1] === undefined) {
  console.error("usage: capture-command.mjs run <receipt> -- <command> [args...]")
  process.exitCode = 2
} else {
  const result = await runAndCapture({
    command: parsed.command,
    args: parsed.args,
    receiptPath: parsed.prefix[1],
  })
  process.exitCode = result.exitCode
}
