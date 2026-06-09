chrome.action.onClicked.addListener(async (tab) => {
  if (!tab.id) return

  // If already injected, just toggle visibility
  try {
    const results = await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: () => {
        const host = document.getElementById('__leadz_root__')
        if (!host) return false
        const panel = host.shadowRoot!.getElementById('lz-panel') as HTMLElement
        panel.style.display = panel.style.display === 'none' ? '' : 'none'
        return true
      },
    })
    if (results?.[0]?.result === true) return
  } catch {}

  await chrome.scripting.executeScript({ target: { tabId: tab.id }, files: ['content.js'] })
})

// Proxy API calls from content script to avoid CORS
chrome.runtime.onMessage.addListener((msg, _sender, sendResponse) => {
  if (msg.type !== 'LEADZ_API') return

  const { path, method, body, token } = msg
  const headers: Record<string, string> = { 'Content-Type': 'application/json' }
  if (token) headers['Authorization'] = `Bearer ${token}`

  fetch(`http://localhost:8000/api${path}`, {
    method: method || 'GET',
    headers,
    body: body ? JSON.stringify(body) : undefined,
  })
    .then(async (res) => {
      const data = res.status !== 204 ? await res.json().catch(() => null) : null
      sendResponse({ ok: res.ok, status: res.status, data })
    })
    .catch((err) => sendResponse({ ok: false, status: 0, error: err.message }))

  return true // keep channel open for async response
})
