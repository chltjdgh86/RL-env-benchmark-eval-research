import { createWriteStream, mkdirSync } from "node:fs"
import { dirname, resolve } from "node:path"
import { fileURLToPath } from "node:url"
import {
  createTerminationWatcher,
  signalExitCode,
  spawnManaged,
  terminateProcessTree,
} from "./process-lifecycle.mjs"

const argv = process.argv.slice(2)
const logFlagIndex = argv.indexOf("--log")
const separatorIndex = argv.indexOf("--")
const logPath = logFlagIndex === -1 ? undefined : argv[logFlagIndex + 1]
const command = separatorIndex === -1 ? undefined : argv[separatorIndex + 1]
const commandArgs = separatorIndex === -1 ? [] : argv.slice(separatorIndex + 2)
const viteExecutable = resolve(
  dirname(fileURLToPath(import.meta.url)),
  "../../node_modules/.bin/vite",
)

function observeProcess(child) {
  return new Promise((resolve) => {
    child.once("error", (error) => resolve({ kind: "spawn-error", error }))
    child.once("close", (exitCode, signal) => {
      resolve({ kind: "exit", exitCode, signal })
    })
  })
}

function childExitCode(outcome) {
  if (outcome.exitCode !== null) {
    return outcome.exitCode
  }
  return outcome.signal === null ? 1 : signalExitCode(outcome.signal)
}

function delay(milliseconds) {
  return new Promise((resolve) => setTimeout(resolve, milliseconds))
}

async function waitForOwnedPreview(previewState, termination) {
  for (let attempt = 0; attempt < 100; attempt += 1) {
    if (termination.signal !== null) {
      return { kind: "termination", signal: termination.signal }
    }
    if (previewState.error !== null) {
      return { kind: "spawn-error", error: previewState.error }
    }
    if (previewState.exitCode !== null) {
      return { kind: "exit", exitCode: previewState.exitCode }
    }
    const match = previewState.output.match(/Local:\s+(http:\/\/127\.0\.0\.1:\d+)\/?/)
    const url = match?.[1]
    if (url !== undefined) {
      try {
        const response = await fetch(url, { signal: AbortSignal.timeout(500) })
        if (response.ok) {
          return { kind: "ready", url }
        }
      } catch (error) {
        const expectedNetworkFailure =
          error instanceof TypeError ||
          (error instanceof DOMException &&
            (error.name === "TimeoutError" || error.name === "AbortError"))
        if (!expectedNetworkFailure) {
          throw error
        }
      }
    }
    await delay(100)
  }
  return { kind: "timeout" }
}

if (logPath === undefined || command === undefined) {
  console.error("usage: with-preview.mjs --log <receipt> -- <command> [args...]")
  process.exitCode = 2
} else {
  mkdirSync(dirname(logPath), { recursive: true })
  const log = createWriteStream(logPath, { flags: "w" })
  const termination = createTerminationWatcher()
  let build = null
  let preview = null
  let child = null
  let commandExitCode = 1

  const write = (target, chunk) => {
    target.write(chunk)
    log.write(chunk)
  }
  const message = (target, value) => write(target, `${value}\n`)
  const forward =
    (target, onChunk = () => {}) =>
    (chunk) => {
      onChunk(String(chunk))
      write(target, chunk)
    }

  try {
    build = spawnManaged("bun", ["run", "build"], {
      stdio: ["ignore", "pipe", "pipe"],
    })
    build.stdout.on("data", forward(process.stdout))
    build.stderr.on("data", forward(process.stderr))
    const buildOutcome = await Promise.race([
      observeProcess(build),
      termination.received.then((signal) => ({ kind: "termination", signal })),
    ])

    if (buildOutcome.kind === "termination") {
      commandExitCode = signalExitCode(buildOutcome.signal)
    } else if (buildOutcome.kind === "spawn-error") {
      message(process.stderr, `PREVIEW_BUILD_SPAWN_FAILED:${buildOutcome.error.message}`)
    } else if (childExitCode(buildOutcome) !== 0) {
      commandExitCode = childExitCode(buildOutcome)
      message(process.stderr, `PREVIEW_BUILD_FAILED:${commandExitCode}`)
    } else {
      const previewState = { error: null, exitCode: null, output: "" }
      preview = spawnManaged(
        viteExecutable,
        ["preview", "--host", "127.0.0.1", "--port", "0", "--strictPort"],
        { stdio: ["ignore", "pipe", "pipe"] },
      )
      preview.stdout.on(
        "data",
        forward(process.stdout, (chunk) => {
          previewState.output += chunk
        }),
      )
      preview.stderr.on(
        "data",
        forward(process.stderr, (chunk) => {
          previewState.output += chunk
        }),
      )
      preview.once("error", (error) => {
        previewState.error = error
      })
      preview.once("close", (exitCode) => {
        previewState.exitCode = exitCode ?? 1
      })

      const readyOutcome = await waitForOwnedPreview(previewState, termination)
      if (readyOutcome.kind === "termination") {
        commandExitCode = signalExitCode(readyOutcome.signal)
      } else if (readyOutcome.kind === "spawn-error") {
        message(process.stderr, `PREVIEW_PROCESS_SPAWN_FAILED:${readyOutcome.error.message}`)
      } else if (readyOutcome.kind === "exit") {
        message(process.stderr, `PREVIEW_START_FAILED:${readyOutcome.exitCode}`)
      } else if (readyOutcome.kind === "timeout") {
        message(process.stderr, "PREVIEW_START_FAILED:timeout")
      } else {
        message(process.stdout, `PREVIEW_READY:${readyOutcome.url}`)
        child = spawnManaged(command, commandArgs, {
          env: { ...process.env, PLAYWRIGHT_BASE_URL: readyOutcome.url },
          stdio: ["inherit", "pipe", "pipe"],
        })
        child.stdout.on("data", forward(process.stdout))
        child.stderr.on("data", forward(process.stderr))
        const childOutcome = await Promise.race([
          observeProcess(child),
          termination.received.then((signal) => ({ kind: "termination", signal })),
        ])
        if (childOutcome.kind === "termination") {
          commandExitCode = signalExitCode(childOutcome.signal)
        } else if (childOutcome.kind === "spawn-error") {
          message(process.stderr, `PREVIEW_CHILD_SPAWN_FAILED:${childOutcome.error.message}`)
        } else {
          commandExitCode = childExitCode(childOutcome)
        }
      }
    }
  } finally {
    if (child !== null) {
      await terminateProcessTree(child)
    }
    if (preview !== null) {
      await terminateProcessTree(preview)
    }
    if (build !== null) {
      await terminateProcessTree(build)
    }
    termination.dispose()
    log.write("PREVIEW_CLEANUP:complete\n")
    await new Promise((resolve) => log.end(resolve))
    console.log("PREVIEW_CLEANUP:complete")
  }
  process.exitCode = commandExitCode
}
