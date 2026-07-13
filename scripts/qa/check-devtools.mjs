import { existsSync, readdirSync, readFileSync } from "node:fs"
import { extname, join } from "node:path"

const directoryFlagIndex = process.argv.indexOf("--dir")
const directory = directoryFlagIndex === -1 ? "dist" : process.argv[directoryFlagIndex + 1]

function collectBuildFiles(path) {
  const files = []
  for (const entry of readdirSync(path, { withFileTypes: true })) {
    const entryPath = join(path, entry.name)
    if (entry.isDirectory()) {
      files.push(...collectBuildFiles(entryPath))
    } else if ([".html", ".js", ".mjs", ".css", ".map"].includes(extname(entry.name))) {
      files.push(entryPath)
    }
  }
  return files
}

if (directory === undefined || !existsSync(directory)) {
  console.error("DEVTOOLS_BUILD_ARTIFACT_MISSING")
  process.exitCode = 1
} else {
  const forbidden = ["react-grab", "react-scan", "react-doctor"]
  const sourceGateErrors = []
  const leaks = collectBuildFiles(directory).flatMap((file) => {
    const source = readFileSync(file, "utf8")
    return forbidden.filter((name) => source.includes(name)).map((name) => `${file}:${name}`)
  })

  if (leaks.length > 0 || sourceGateErrors.length > 0) {
    for (const sourceGateError of sourceGateErrors) {
      console.error(sourceGateError)
    }
    for (const leak of leaks) {
      console.error(`DEVTOOLS_PRODUCTION_LEAK:${leak}`)
    }
    process.exitCode = 1
  } else {
    console.log("DEVTOOLS_PRODUCTION_CLEAN")
  }
}
