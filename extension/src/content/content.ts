import type { ScanResult } from '../types'

function extractEmails(text: string): string[] {
  const regex = /[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}/g
  return [...new Set(text.match(regex) ?? [])]
}

function extractPhones(text: string): string[] {
  const regex = /(?:\+?\d[\d\s\-().]{7,}\d)/g
  const matches = text.match(regex) ?? []
  return [...new Set(matches.map((p) => p.trim()).filter((p) => p.replace(/\D/g, '').length >= 7))]
}

function findFaviconUrl(): string | null {
  // Prefer apple-touch-icon (high-res, usually 180×180)
  const apple = document.querySelector<HTMLLinkElement>('link[rel="apple-touch-icon"]')
  if (apple?.href) return apple.href

  // Largest sized icon
  const icons = Array.from(document.querySelectorAll<HTMLLinkElement>('link[rel~="icon"]'))
  icons.sort((a, b) => {
    const size = (el: HTMLLinkElement) => parseInt(el.getAttribute('sizes')?.split('x')[0] ?? '0') || 0
    return size(b) - size(a)
  })
  if (icons[0]?.href) return icons[0].href

  const shortcut = document.querySelector<HTMLLinkElement>('link[rel="shortcut icon"]')
  if (shortcut?.href) return shortcut.href

  return `${window.location.origin}/favicon.ico`
}

function findOgImageUrl(): string | null {
  const og = document.querySelector<HTMLMetaElement>('meta[property="og:image"]')
  const content = og?.getAttribute('content')
  if (!content) return null
  try { return new URL(content, window.location.href).href } catch { return null }
}

function findLogoUrl(): string | null {
  const selectors = [
    'header img[class*="logo"i]',
    'header img[id*="logo"i]',
    'nav img[class*="logo"i]',
    'nav img[id*="logo"i]',
    'a[class*="logo"i] img',
    'a[id*="logo"i] img',
    '[class*="navbar"i] img',
    '[class*="header"i] img[class*="logo"i]',
    'img[class*="logo"i]',
    'img[id*="logo"i]',
    'img[alt*="logo"i]',
  ]
  for (const sel of selectors) {
    const img = document.querySelector<HTMLImageElement>(sel)
    if (img?.src && !img.src.startsWith('data:')) return img.src
  }
  return null
}

function scanPage(): ScanResult {
  const url = window.location.href
  const domain = window.location.hostname.replace(/^www\./, '')
  const title = document.title || null
  const metaEl = document.querySelector('meta[name="description"]')
  const metaDescription = metaEl?.getAttribute('content') ?? null

  const h1Texts = Array.from(document.querySelectorAll('h1'))
    .map((el) => el.textContent?.trim() ?? '')
    .filter(Boolean)
    .slice(0, 5)

  const bodyText = document.body?.innerText ?? ''
  const detectedEmails = extractEmails(bodyText)
  const detectedPhones = extractPhones(bodyText)

  return {
    url,
    domain,
    title,
    metaDescription,
    h1Texts,
    detectedEmails,
    detectedPhones,
    faviconUrl: findFaviconUrl(),
    ogImageUrl: findOgImageUrl(),
    logoUrl: findLogoUrl(),
  }
}

chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message.type === 'SCAN_PAGE') {
    sendResponse({ type: 'SCAN_RESULT', data: scanPage() })
  }
  return true
})
