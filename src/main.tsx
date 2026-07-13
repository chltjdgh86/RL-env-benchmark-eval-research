import "@fontsource/barlow-condensed/latin-400.css"
import "@fontsource/barlow-condensed/latin-600.css"
import "@fontsource/barlow-condensed/latin-700.css"
import "@fontsource/barlow-condensed/latin-800.css"
import "@fontsource-variable/newsreader/index.css"
import "@fontsource/ibm-plex-mono/latin-400.css"
import "@fontsource/ibm-plex-mono/latin-600.css"
import "@fontsource/ibm-plex-mono/latin-700.css"
import "./styles/tokens.css"
import "./styles/primitives.css"
import "./styles/app.css"

class AppRootNotFoundError extends Error {
  public constructor() {
    super("The application root element is missing")
    this.name = "AppRootNotFoundError"
  }
}

async function startApplication() {
  const [{ StrictMode }, { createRoot }, { App }] = await Promise.all([
    import("react"),
    import("react-dom/client"),
    import("./App"),
  ])
  const rootElement = document.getElementById("root")
  if (rootElement === null) {
    throw new AppRootNotFoundError()
  }

  createRoot(rootElement).render(
    <StrictMode>
      <App />
    </StrictMode>,
  )
}

void startApplication()
