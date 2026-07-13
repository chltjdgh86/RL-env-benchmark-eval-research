import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

// biome-ignore lint/style/noDefaultExport: Vite requires a default configuration export.
export default defineConfig({
  // Relative base so the hash-routed build works under a GitHub Pages project path.
  base: "./",
  plugins: [react()],
  build: {
    sourcemap: false,
  },
})
