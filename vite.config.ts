import { defineConfig, Plugin } from "vite"
import { defaultConfig, getColorModeScript } from "@yamada-ui/react"
import react from '@vitejs/plugin-react'

function injectScript(): Plugin {
  return {
    name: "vite-plugin-inject-scripts",
    transformIndexHtml(html) {
      const content = getColorModeScript({
        initialColorMode: defaultConfig.initialColorMode,
      })

      return html.replace("<body>", `<body><script>${content}</script>`)
    },
  }
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), injectScript()],
  base: process.env.GITHUB_PAGES ? 'REPOSITORY_NAME' : '/pomodoro-frontend/',
})