import { spawnSync } from "node:child_process"
import { existsSync, readFileSync } from "node:fs"

const packageJson = JSON.parse(readFileSync("package.json", "utf8"))
const dependencyGroups = [packageJson.dependencies, packageJson.devDependencies]
const unpinned = dependencyGroups.flatMap((group) =>
  Object.entries(group).flatMap(([name, version]) =>
    typeof version === "string" && /^\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?$/.test(version)
      ? []
      : [`${name}@${String(version)}`],
  ),
)

const lockHash = spawnSync("bun", ["pm", "hash"], { encoding: "utf8" })
const storedHash = spawnSync("bun", ["pm", "hash-print"], { encoding: "utf8" })
const lockedTree = spawnSync("bun", ["pm", "ls"], { encoding: "utf8" })
const errors = []
const storedHashValue = storedHash.stdout.trim()
const storedHashIsSentinel = /^0+(?:-0+)*$/.test(storedHashValue)

if (!existsSync("bun.lock")) {
  errors.push("BUN_LOCK_MISSING")
}
if (unpinned.length > 0) {
  errors.push(`DEPENDENCIES_NOT_EXACT:${unpinned.join(",")}`)
}
if (lockHash.status !== 0 || lockHash.stdout.trim().length === 0) {
  errors.push("BUN_LOCK_HASH_COMMAND_FAILED")
} else if (
  storedHash.status === 0 &&
  storedHashValue.length > 0 &&
  !storedHashIsSentinel &&
  lockHash.stdout.trim() !== storedHashValue
) {
  errors.push("BUN_LOCK_HASH_DRIFT")
}
if (lockedTree.status !== 0 || lockedTree.stdout.trim().length === 0) {
  errors.push("BUN_LOCK_TREE_INVALID")
}

if (errors.length > 0) {
  for (const error of errors) {
    console.error(error)
  }
  process.exitCode = 1
} else {
  console.log(`BUN_LOCK_OK:${lockHash.stdout.trim()}`)
}
