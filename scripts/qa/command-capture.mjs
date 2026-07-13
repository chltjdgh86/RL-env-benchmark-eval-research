import { createWriteStream, mkdirSync } from "node:fs"
import { dirname } from "node:path"
import {
  createTerminationWatcher,
  signalExitCode,
  spawnManaged,
  terminateProcessTree,
} from "./process-lifecycle.mjs"

export async function runAndCapture({ command, args, receiptPath, env = process.env }) {
  mkdirSync(dirname(receiptPath), { recursive: true })
  const receipt = createWriteStream(receiptPath, { flags: "w" })
  const chunks = []
  const child = spawnManaged(command, args, {
    env,
    stdio: ["inherit", "pipe", "pipe"],
  })
  const termination = createTerminationWatcher()

  const forward = (target) => (chunk) => {
    chunks.push(chunk)
    target.write(chunk)
    receipt.write(chunk)
  }

  child.stdout.on("data", forward(process.stdout))
  child.stderr.on("data", forward(process.stderr))

  const childResult = new Promise((resolve) => {
    child.once("error", (error) => resolve({ kind: "spawn-error", error }))
    child.once("close", (exitCode, signal) => {
      resolve({ kind: "exit", exitCode, signal })
    })
  })
  let result
  try {
    const outcome = await Promise.race([
      childResult,
      termination.received.then((signal) => ({ kind: "termination", signal })),
    ])
    if (outcome.kind === "spawn-error") {
      throw outcome.error
    }
    if (outcome.kind === "termination") {
      await terminateProcessTree(child)
      result = { exitCode: signalExitCode(outcome.signal), signal: outcome.signal }
    } else {
      result = {
        exitCode:
          outcome.exitCode ?? (outcome.signal === null ? 1 : signalExitCode(outcome.signal)),
        signal: outcome.signal,
      }
    }
  } finally {
    termination.dispose()
    await new Promise((resolve) => receipt.end(resolve))
  }

  return {
    ...result,
    output: Buffer.concat(chunks).toString("utf8"),
  }
}

export function parseCapturedCommand(argv, prefixLength) {
  const separatorIndex = argv.indexOf("--")
  if (separatorIndex < prefixLength || separatorIndex === argv.length - 1) {
    return null
  }

  const command = argv[separatorIndex + 1]
  if (command === undefined) {
    return null
  }

  return {
    command,
    args: argv.slice(separatorIndex + 2),
    prefix: argv.slice(0, separatorIndex),
  }
}
