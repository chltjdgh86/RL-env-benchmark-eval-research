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
