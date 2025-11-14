import { fileURLToPath, URL } from 'node:url'
import fs from 'node:fs'
import yaml from 'js-yaml'
import type { Plugin, ViteDevServer, HmrContext } from 'vite'
import type { Index } from '../config'

const path = fileURLToPath(new URL('../../_config.yml', import.meta.url))
const vid = 'virtual:config'

const read = (): Index => {
  const raw = fs.readFileSync(path, 'utf8')
  return yaml.load(raw) as Index
}

export function config(): Plugin {
  return {
    name: 'config',
    enforce: 'pre',
    load(id: string) {
      if (id === '\0' + vid) {
        const cfg = read()
        return `export default ${JSON.stringify(cfg)}`
      }
      return null
    },
    resolveId(id: string) {
      if (id === vid) return '\0' + vid
      return null
    },
    transformIndexHtml(html: string) {
      const { site } = read()
      const placeholders: Record<string, string> = {
        '%%SITE_TITLE%%': site.title,
        '%%SITE_DESCRIPTION%%': site.description,
        '%%SITE_ICON%%': site.icon,
      }
      return html.replace(
        /%%SITE_TITLE%%|%%SITE_DESCRIPTION%%|%%SITE_ICON%%/g,
        (m) => placeholders[m] ?? m,
      )
    },
    configureServer(server: ViteDevServer) {
      server.watcher.add(path)
      server.watcher.on('change', (p: string) => {
        if (p === path) {
          const mod = server.moduleGraph.getModuleById('\0' + vid)
          if (mod) server.moduleGraph.invalidateModule(mod)
          server.ws.send({ type: 'full-reload' })
        }
      })
    },
    handleHotUpdate(ctx: HmrContext) {
      if (ctx.file === path) {
        const mod = ctx.server.moduleGraph.getModuleById('\0' + vid)
        if (mod) ctx.server.moduleGraph.invalidateModule(mod)
        ctx.server.ws.send({ type: 'full-reload' })
        return []
      }
    },
  }
}
