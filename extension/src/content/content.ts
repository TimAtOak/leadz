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

  return { url, domain, title, metaDescription, h1Texts, detectedEmails, detectedPhones }
}

chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message.type === 'SCAN_PAGE') {
    sendResponse({ type: 'SCAN_RESULT', data: scanPage() })
  }
  return true
})
