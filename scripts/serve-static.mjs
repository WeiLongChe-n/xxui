/**
 * 极简静态服务器，用于在「子路径」下预览部署产物。
 * 模拟 Gitee Pages 的访问方式：https://<user>.gitee.io/<repo>/...
 *
 * 用法：node scripts/serve-static.mjs [产物目录] [base] [端口]
 *      node scripts/serve-static.mjs .vitepress/dist-gitee vela-ui 4180
 *      → http://localhost:4180/vela-ui/
 */
import http from 'node:http'
import fs from 'node:fs'
import path from 'node:path'

const dir = path.resolve(process.argv[2] || 'docs/.vitepress/dist')
const rawBase = (process.argv[3] || '').replace(/^\/+|\/+$/g, '')
const base = rawBase ? `/${rawBase}/` : '/'
const port = Number(process.argv[4] || 4180)

const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.map': 'application/json; charset=utf-8',
}

const server = http.createServer((req, res) => {
  const url = decodeURIComponent(req.url.split('?')[0])

  if (url === base.slice(0, -1)) {
    res.writeHead(301, { Location: base })
    res.end()
    return
  }
  if (!url.startsWith(base)) {
    res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' })
    res.end(`404 —— 该服务器的挂载点是 ${base}`)
    return
  }

  let rel = url.slice(base.length)
  if (rel === '' || rel.endsWith('/')) rel += 'index.html'

  const file = path.join(dir, rel)
  // 防止路径穿越
  if (!file.startsWith(dir)) {
    res.writeHead(403)
    res.end()
    return
  }

  // 依次尝试：原路径 → 补 .html → 目录 index.html（兼容 cleanUrls）
  const candidates = [file, `${file}.html`, path.join(file, 'index.html')]

  const send = (index) => {
    if (index >= candidates.length) {
      res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' })
      res.end('404 ' + rel)
      return
    }
    const current = candidates[index]
    fs.readFile(current, (err, buf) => {
      if (err) {
        send(index + 1)
        return
      }
      res.writeHead(200, {
        'Content-Type': TYPES[path.extname(current)] || 'application/octet-stream',
      })
      res.end(buf)
    })
  }

  send(0)
})

server.listen(port, '127.0.0.1', () => {
  console.log(`静态预览: http://localhost:${port}${base}`)
  console.log(`挂载目录: ${dir}`)
})
