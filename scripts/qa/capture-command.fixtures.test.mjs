import assert from "node:assert/strict"
import { spawn, spawnSync } from "node:child_process"
import { mkdtempSync, readFileSync, rmSync } from "node:fs"
import { tmpdir } from "node:os"
import { join } from "node:path"
import test from "node:test"

function waitForOutput(child, expected) {
  return new Promise((resolve, reject) => {
    const timeout = setTimeout(() => reject(new Error(`OUTPUT_TIMEOUT:${expected}`)), 5_000)
    const inspect = (chunk) => {
      const output = String(chunk)
      if (output.includes(expected)) {
        clearTimeout(timeout)
        resolve(output)
      }
    }
    child.stdout.on("data", inspect)
    child.stderr.on("data", inspect)
  })
}

function processIsAlive(pid) {
  try {
    process.kill(pid, 0)
    return true
  } catch (error) {
    if (error instanceof Error && "code" in error && error.code === "ESRCH") {
      return false
    }
    throw error
  }
}

function forceKillGroup(pid) {
  try {
    process.kill(-pid, "SIGKILL")
  } catch (error) {
    if (!(error instanceof Error && "code" in error && error.code === "ESRCH")) {
      throw error
    }
  }
}

test("preserves the child exit code while capturing its output", () => {
  // Given: a child process that writes one line and exits with status seven.
  const temporaryDirectory = mkdtempSync(join(tmpdir(), "atlas-capture-"))
  const receiptPath = join(temporaryDirectory, "receipt.txt")
  try {
    // When: capture-command runs the child and tees its output.
    const result = spawnSync(
      process.execPath,
      [
        "scripts/qa/capture-command.mjs",
        "run",
        receiptPath,
        "--",
        process.execPath,
        "-e",
        'process.stderr.write("CHILD_FAILURE\\n"); process.exit(7)',
      ],
      { encoding: "utf8" },
    )
    // Then: the wrapper returns seven and the receipt contains the child output.
    assert.equal(result.status, 7)
    assert.equal(readFileSync(receiptPath, "utf8"), "CHILD_FAILURE\n")
  } finally {
    rmSync(temporaryDirectory, { recursive: true })
  }
})

test("terminates the captured child when the wrapper receives SIGTERM", async () => {
  // Given: a capture wrapper with a long-running child in an isolated process group.
  const temporaryDirectory = mkdtempSync(join(tmpdir(), "atlas-capture-signal-"))
  const receiptPath = join(temporaryDirectory, "receipt.txt")
  const childMarker = "CAPTURE_SIGNAL_CHILD_PID:"
  const wrapper = spawn(
    process.execPath,
    [
      "scripts/qa/capture-command.mjs",
      "run",
      receiptPath,
      "--",
      process.execPath,
      "-e",
      `console.log("${childMarker}" + process.pid); setInterval(() => {}, 1_000)`,
    ],
    { detached: true, stdio: ["ignore", "pipe", "pipe"] },
  )
  assert.notEqual(wrapper.pid, undefined)
  const wrapperPid = wrapper.pid ?? 0
  let childPid = 0

  try {
    const output = await waitForOutput(wrapper, childMarker)
    childPid = Number.parseInt(output.slice(output.indexOf(childMarker) + childMarker.length), 10)
    assert.ok(Number.isSafeInteger(childPid))

    // When: the wrapper is cancelled by its caller.
    wrapper.kill("SIGTERM")
    const [exitCode] = await new Promise((resolve) =>
      wrapper.once("close", (...args) => resolve(args)),
    )
    await new Promise((resolve) => setTimeout(resolve, 250))

    // Then: cancellation is preserved and the captured process is no longer alive.
    assert.equal(exitCode, 143)
    assert.equal(processIsAlive(childPid), false)
  } finally {
    forceKillGroup(wrapperPid)
    if (childPid > 0 && processIsAlive(childPid)) {
      process.kill(childPid, "SIGKILL")
    }
    rmSync(temporaryDirectory, { recursive: true })
  }
})
