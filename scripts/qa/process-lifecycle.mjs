import { spawn } from "node:child_process"
import { constants } from "node:os"

const managedSignals = ["SIGINT", "SIGTERM"]

function isMissingProcessError(error) {
  return error instanceof Error && "code" in error && error.code === "ESRCH"
}

function processTarget(pid) {
  return process.platform === "win32" ? pid : -pid
}

function processTreeIsAlive(child) {
  if (child.pid === undefined) {
    return false
  }
  try {
    process.kill(processTarget(child.pid), 0)
    return true
  } catch (error) {
    if (isMissingProcessError(error)) {
      return false
    }
    throw error
  }
}

function signalProcessTree(child, signal) {
  if (child.pid === undefined) {
    return
  }
  try {
    process.kill(processTarget(child.pid), signal)
  } catch (error) {
    if (!isMissingProcessError(error)) {
      throw error
    }
  }
}

function delay(milliseconds) {
  return new Promise((resolve) => setTimeout(resolve, milliseconds))
}

export function signalExitCode(signal) {
  const signalNumber = constants.signals[signal]
  return signalNumber === undefined ? 1 : 128 + signalNumber
}

export function spawnManaged(command, args, options) {
  return spawn(command, args, {
    ...options,
    detached: process.platform !== "win32",
  })
}

export function createTerminationWatcher() {
  let signal = null
  let resolveSignal = () => {}
  const received = new Promise((resolve) => {
    resolveSignal = resolve
  })
  const listeners = new Map(
    managedSignals.map((managedSignal) => [
      managedSignal,
      () => {
        if (signal === null) {
          signal = managedSignal
          resolveSignal(managedSignal)
        }
      },
    ]),
  )

  for (const [managedSignal, listener] of listeners) {
    process.on(managedSignal, listener)
  }

  return {
    received,
    get signal() {
      return signal
    },
    dispose() {
      for (const [managedSignal, listener] of listeners) {
        process.off(managedSignal, listener)
      }
    },
  }
}

export async function terminateProcessTree(child, graceMilliseconds = 2_000) {
  if (!processTreeIsAlive(child)) {
    return
  }

  signalProcessTree(child, "SIGTERM")
  const deadline = Date.now() + graceMilliseconds
  while (processTreeIsAlive(child) && Date.now() < deadline) {
    await delay(25)
  }
  if (!processTreeIsAlive(child)) {
    return
  }

  signalProcessTree(child, "SIGKILL")
  const killDeadline = Date.now() + 500
  while (processTreeIsAlive(child) && Date.now() < killDeadline) {
    await delay(25)
  }
  if (processTreeIsAlive(child)) {
    throw new Error(`PROCESS_TREE_CLEANUP_FAILED:${child.pid ?? "unknown"}`)
  }
}
