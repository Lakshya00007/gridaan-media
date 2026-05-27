import fs from 'fs'
import path from 'path'

const distIndex = path.resolve(process.cwd(), 'dist', 'index.html')
if (!fs.existsSync(distIndex)) {
  console.warn('[remove-preloads] dist/index.html not found, skipping')
  process.exit(0)
}

let html = fs.readFileSync(distIndex, 'utf8')

// Remove modulepreload links for vendor-editor and vendor-motion only
html = html.split('\n').filter(line => {
  const isPreload = line.includes('rel="modulepreload"')
  if (!isPreload) return true
  if (line.includes('vendor-editor') || line.includes('vendor-motion')) {
    console.log('[remove-preloads] removing preload:', line.trim())
    return false
  }
  return true
}).join('\n')

fs.writeFileSync(distIndex, html, 'utf8')
console.log('[remove-preloads] Done')
