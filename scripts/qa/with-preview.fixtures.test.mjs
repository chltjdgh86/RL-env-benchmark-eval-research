import assert from "node:assert/strict"
import { spawn, spawnSync } from "node:child_process"
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs"
import { createServer } from "node:http"
import { tmpdir } from "node:os"
import { join, resolve } from "node:path"
import test from "node:test"

const wrapperPath = resolve("scripts/qa/with-preview.mjs")
const viteExecutable = resolve("node_modules/.bin/vite")

function isMissingProcessError(error) {
  return error instanceof Error && "code" in error && error.code === "ESRCH"
}

function processIsAlive(pid) {
  try {
    process.kill(pid, 0)
    return true
  } catch (error) {
    if (isMissingProcessError(error)) {
      return false
    }
    throw error
  }
}

function forceKillGroup(pid) {
  try {
    process.kill(-pid, "SIGKILL")
  } catch (error) {
    if (!isMissingProcessError(error)) {
      throw error
    }
  }
}

function waitForOutput(state, expected) {
  if (state.output.includes(expected)) {
    return Promise.resolve()
  }
  return new Promise((resolve, reject) => {
    const timeout = setTimeout(() => reject(new Error(`OUTPUT_TIMEOUT:${expected}`)), 10_000)
    state.waiters.push({
      expected,
      resolve: () => {
        clearTimeout(timeout)
        resolve()
      },
    })
  })
}

function createPreviewProject(prefix) {
  const directory = mkdtempSync(join(tmpdir(), prefix))
  mkdirSync(join(directory, "src"))
  writeFileSync(
    join(directory, "package.json"),
    `${JSON.stringify({ scripts: { build: `${viteExecutable} build` } }, null, 2)}\n`,
  )
  writeFileSync(
    join(directory, "index.html"),
    '<div id="root"><!-- GENERATED:NO_JS_FALLBACK --></div><script type="module" src="/src/main.js"></script>',
  )
  writeFileSync(
    join(directory, "src/main.js"),
    'document.querySelector("#root").textContent = "ready"',
  )
  return directory
}

function spawnPreviewWrapper(projectDirectory, receiptPath, childArgs) {
  const wrapper = spawn(process.execPath, [wrapperPath, "--log", receiptPath, "--", ...childArgs], {
    cwd: projectDirectory,
    detached: true,
    stdio: ["ignore", "pipe", "pipe"],
  })
  const state = { output: "", waiters: [] }
  const collect = (chunk) => {
    state.output += String(chunk)
    for (const waiter of state.waiters) {
      if (state.output.includes(waiter.expected)) {
        waiter.resolve()
      }
    }
    state.waiters = state.waiters.filter((waiter) => !state.output.includes(waiter.expected))
  }
  wrapper.stdout.on("data", collect)
  wrapper.stderr.on("data", collect)
  return { state, wrapper }
}

function waitForClose(child, timeoutMilliseconds = 15_000) {
  return new Promise((resolve, reject) => {
    const timeout = setTimeout(
      () => reject(new Error("PROCESS_CLOSE_TIMEOUT")),
      timeoutMilliseconds,
    )
    child.once("error", reject)
    child.once("close", (exitCode, signal) => {
      clearTimeout(timeout)
      resolve({ exitCode, signal })
    })
  })
}

async function closeServer(server) {
  await new Promise((resolve, reject) => {
    server.close((error) => (error === undefined ? resolve() : reject(error)))
  })
}

function cleanupPort(url) {
  const port = new URL(url).port
  const listenerResult = spawnSync("lsof", [`-tiTCP:${port}`, "-sTCP:LISTEN"], {
    encoding: "utf8",
  })
  for (const value of listenerResult.stdout.trim().split("\n")) {
    const pid = Number.parseInt(value, 10)
    if (Number.isSafeInteger(pid) && processIsAlive(pid)) {
      process.kill(pid, "SIGKILL")
    }
  }
}

test("serves a freshly built owned preview when the default port has a decoy", async () => {
  // Given: an unrelated HTTP 200 server occupying the historical preview port.
  const temporaryDirectory = createPreviewProject("atlas-preview-decoy-")
  const decoy = createServer((_request, response) => {
    response.writeHead(200, { "content-type": "text/html" })
    response.end("<main>decoy</main>")
  })
  await new Promise((resolve, reject) => {
    decoy.once("error", reject)
    decoy.listen(4173, "127.0.0.1", resolve)
  })
  const probe = [
    "-e",
    [
      "const response = await fetch(process.env.PLAYWRIGHT_BASE_URL)",
      "const body = await response.text()",
      'if (!body.includes("GENERATED:NO_JS_FALLBACK")) process.exit(9)',
      'console.log("OWNED_PREVIEW_CONFIRMED")',
    ].join("; "),
  ]

  try {
    // When: the preview wrapper builds and launches its own server.
    const { state, wrapper } = spawnPreviewWrapper(
      temporaryDirectory,
      join(temporaryDirectory, "receipt.txt"),
      [process.execPath, ...probe],
    )
    const result = await waitForClose(wrapper)
    // Then: the child sees the owned build, never the unrelated HTTP 200 response.
    assert.equal(result.exitCode, 0, state.output)
    assert.match(state.output, /building client environment/)
    assert.match(state.output, /OWNED_PREVIEW_CONFIRMED/)
  } finally {
    await closeServer(decoy)
    rmSync(temporaryDirectory, { recursive: true })
  }
})

test("terminates the preview and command trees when the wrapper receives SIGTERM", async () => {
  // Given: an isolated preview wrapper with a long-running child.
  const temporaryDirectory = createPreviewProject("atlas-preview-signal-")
  const childMarker = "PREVIEW_SIGNAL_CHILD_PID:"
  const { state, wrapper } = spawnPreviewWrapper(
    temporaryDirectory,
    join(temporaryDirectory, "receipt.txt"),
    [
      process.execPath,
      "-e",
      `console.log("${childMarker}" + process.pid); setInterval(() => {}, 1_000)`,
    ],
  )
  assert.notEqual(wrapper.pid, undefined)
  const wrapperPid = wrapper.pid ?? 0
  let childPid = 0
  let previewUrl = "http://127.0.0.1:4173"
  let exitCode = null
  let listening = true
  let childAlive = true

  try {
    await waitForOutput(state, "PREVIEW_READY:")
    await waitForOutput(state, childMarker)
    childPid = Number.parseInt(
      state.output.slice(state.output.indexOf(childMarker) + childMarker.length),
      10,
    )
    const urlMatch = state.output.match(/PREVIEW_READY:(http:\/\/127\.0\.0\.1:\d+)/)
    previewUrl = urlMatch?.[1] ?? previewUrl

    // When: the wrapper is cancelled by its caller.
    wrapper.kill("SIGTERM")
    ;[exitCode] = await new Promise((resolve) => wrapper.once("close", (...args) => resolve(args)))
    await new Promise((resolve) => setTimeout(resolve, 300))
    try {
      listening = (await fetch(previewUrl)).ok
    } catch (error) {
      if (!(error instanceof TypeError)) {
        throw error
      }
      listening = false
    }
    childAlive = processIsAlive(childPid)
  } finally {
    forceKillGroup(wrapperPid)
    if (childPid > 0 && processIsAlive(childPid)) {
      forceKillGroup(childPid)
      if (processIsAlive(childPid)) {
        process.kill(childPid, "SIGKILL")
      }
    }
    cleanupPort(previewUrl)
    rmSync(temporaryDirectory, { recursive: true })
  }

  // Then: cancellation is preserved and both managed process trees are gone.
  assert.equal(exitCode, 143)
  assert.equal(listening, false)
  assert.equal(childAlive, false)
})
