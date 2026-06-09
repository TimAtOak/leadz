chrome.action.onClicked.addListener(async (tab) => {
  // Try toggling an already-injected panel first
  try {
    const results = await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: () => {
        const host = document.getElementById('__lc_root__');
        if (!host) return false;
        const panel = host.shadowRoot.getElementById('lc-panel');
        panel.style.display = panel.style.display === 'none' ? '' : 'none';
        return true;
      },
    });
    if (results?.[0]?.result === true) return;
  } catch (_) {}

  // First time — inject the content script
  await chrome.scripting.executeScript({
    target: { tabId: tab.id },
    files: ['content.js'],
  });
});
