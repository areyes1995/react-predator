import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { readFileSync, statSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import type { IncomingMessage, ServerResponse } from 'node:http'

// Serve local-config JSON files as static assets
function serveLocalConfig() {
  return {
    name: 'serve-local-config',
    configureServer(server: import('vite').ViteDevServer) {
      server.middlewares.use('/local-config', async (req: IncomingMessage, res: ServerResponse, next: () => void) => {
        const url = req.url
        if (!url || !url.endsWith('.json')) return next()

        if (req.method === 'POST') {
          let data = ''
          for await (const chunk of req) { data += chunk }
          const filePath = join(process.cwd(), 'local-config', url)
          try {
            const parsed = JSON.parse(data)
            writeFileSync(filePath, JSON.stringify(parsed, null, 2))
            res.writeHead(200, { 'Content-Type': 'application/json' })
            res.end(JSON.stringify({ ok: true }))
          } catch (err) {
            res.writeHead(400, { 'Content-Type': 'application/json' })
            res.end(JSON.stringify({ error: 'Invalid JSON', detail: err }))
          }
          return
        }

        try {
          const filePath = join(process.cwd(), 'local-config', url)
          if (statSync(filePath).isFile()) {
            res.writeHead(200, { 'Content-Type': 'application/json' })
            res.end(readFileSync(filePath))
            return
          }
        } catch {
          // pass through
        }
        next()
      })
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), serveLocalConfig()],
  server: {
    host: true,
    port: 5173,
    strictPort: true,
    watch: {
      usePolling: true,
    },
    hmr: {
      overlay: true,
    },
    proxy: {
      '/api': {
        target: process.env.VITE_API_URL || 'http://localhost:4000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
})