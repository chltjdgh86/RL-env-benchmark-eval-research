import react from "@vitejs/plugin-react"
import { defineConfig } from "vitest/config"

// biome-ignore lint/style/noDefaultExport: Vitest requires a default configuration export.
export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    globals: true,
    include: ["src/**/*.test.{ts,tsx}"],
    setupFiles: ["./src/test/setup.ts"],
  },
})
