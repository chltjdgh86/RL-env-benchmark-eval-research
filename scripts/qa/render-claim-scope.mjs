import { resolve } from "node:path"
import { pathToFileURL } from "node:url"
import { createElement } from "react"
import { renderToStaticMarkup } from "react-dom/server"

const scope = process.argv[2]
const modulePaths = process.argv.slice(3)

if (scope === undefined || modulePaths.length === 0) {
  console.error("usage: render-claim-scope.mjs <scope> <render-module> [render-module...]")
  process.exitCode = 2
} else {
  const renderedScopes = []
  const missingExports = []
  for (const modulePath of modulePaths) {
    const scopeModule = await import(pathToFileURL(resolve(modulePath)).href)
    if (typeof scopeModule.renderClaimScope !== "function") {
      missingExports.push(modulePath)
    } else {
      renderedScopes.push(scopeModule.renderClaimScope())
    }
  }
  if (missingExports.length > 0) {
    console.error(`RENDER_SCOPE_EXPORT_MISSING:${missingExports.join(",")}`)
    process.exitCode = 1
  } else {
    const markup = renderToStaticMarkup(
      createElement("section", { "data-claim-scope": scope }, ...renderedScopes),
    )
    process.stdout.write(markup)
  }
}
