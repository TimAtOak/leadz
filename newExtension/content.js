(() => {
  // Toggle if already injected
  const existing = document.getElementById("__lc_root__");
  if (existing) {
    const panel = existing.shadowRoot.getElementById("lc-panel");
    panel.style.display = panel.style.display === "none" ? "" : "none";
    return;
  }

  const WEBHOOK_URL = "https://dev.kimuno.ch/webhook/new-lead";
  const STORAGE_KEY = "lc_form_state";

  // ── Shadow host ──────────────────────────────────────────────
  const host = document.createElement("div");
  host.id = "__lc_root__";
  host.style.cssText =
    "all:initial;position:fixed;top:0;right:0;z-index:2147483647;";
  document.documentElement.appendChild(host);
  const shadow = host.attachShadow({ mode: "open" });

  // ── CSS ──────────────────────────────────────────────────────
  const style = document.createElement("style");
  style.textContent = `
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    :host { all: initial; }

    #lc-panel {
      position: fixed;
      top: 50%;
      right: 24px;
      transform: translateY(-50%);
      width: 400px;
      background: #fff;
      border-radius: 16px;
      box-shadow: 0 8px 32px rgba(0,0,0,0.18), 0 2px 8px rgba(0,0,0,0.08);
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      font-size: 13px;
      color: #0f1117;
      overflow: hidden;
      -webkit-font-smoothing: antialiased;
      border: 1px solid rgba(0,0,0,0.08);
    }

    /* Titlebar */
    .titlebar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 14px;
      height: 46px;
      background: #fff;
      border-bottom: 1px solid #e4e7ec;
      cursor: default;
      user-select: none;
    }
    .titlebar-left { display: flex; align-items: center; gap: 9px; }
    .logo-mark {
      width: 26px; height: 26px; border-radius: 7px;
      background: #4f6ef7; color: #fff;
      font-weight: 700; font-size: 14px;
      display: flex; align-items: center; justify-content: center;
    }
    .app-logo { display: block; color: #0f1117; }
    .close-btn {
      width: 28px; height: 28px; border-radius: 7px;
      background: none; border: none; cursor: pointer;
      color: #9ca3af;
      display: flex; align-items: center; justify-content: center;
      transition: background .15s, color .15s;
    }
    .close-btn:hover { background: #fee2e2; color: #dc2626; }

    /* Content */
    .content {
      padding: 18px 18px 16px;
      max-height: calc(100vh - 100px);
      overflow-y: auto;
    }
    .content::-webkit-scrollbar { width: 5px; }
    .content::-webkit-scrollbar-track { background: transparent; }
    .content::-webkit-scrollbar-thumb { background: #e4e7ec; border-radius: 99px; }

    h1 { font-size: 17px; font-weight: 700; letter-spacing: -0.3px; margin-bottom: 16px; }

    .field { margin-bottom: 13px; }
    label {
      display: block; font-size: 11px; font-weight: 600;
      color: #6b7280; text-transform: uppercase; letter-spacing: 0.5px;
      margin-bottom: 5px;
    }

    input[type="text"], input[type="email"] {
      width: 100%; padding: 9px 11px;
      border: 1.5px solid #e4e7ec; border-radius: 9px;
      font-size: 13px; color: #0f1117; background: #fff;
      outline: none; font-family: inherit;
      box-shadow: 0 1px 2px rgba(0,0,0,0.05);
      transition: border-color .15s, box-shadow .15s;
    }
    input[type="text"]:hover, input[type="email"]:hover { border-color: #c8cfe0; }
    input[type="text"]:focus, input[type="email"]:focus {
      border-color: #4f6ef7;
      box-shadow: 0 0 0 3px rgba(79,110,247,0.15);
    }
    input::placeholder { color: #c0c5d6; }

    /* Domain prefix */
    .prefix-wrap {
      display: flex; align-items: center;
      border: 1.5px solid #e4e7ec; border-radius: 9px;
      background: #fff; overflow: hidden;
      box-shadow: 0 1px 2px rgba(0,0,0,0.05);
      transition: border-color .15s, box-shadow .15s;
    }
    .prefix-wrap:hover:not(:focus-within) { border-color: #c8cfe0; }
    .prefix-wrap:focus-within {
      border-color: #4f6ef7;
      box-shadow: 0 0 0 3px rgba(79,110,247,0.15);
    }
    .prefix {
      padding: 9px 9px 9px 11px; font-size: 12px;
      color: #9ca3af; background: #f7f8fc;
      border-right: 1.5px solid #e4e7ec; white-space: nowrap; user-select: none;
    }
    .prefix-wrap input {
      border: none; border-radius: 0; box-shadow: none;
      flex: 1; padding-left: 9px;
    }
    .prefix-wrap input:focus { box-shadow: none; border: none; }

    /* Email suffix (mirrors prefix-wrap) */
    .suffix-wrap {
      display: flex; align-items: center;
      border: 1.5px solid #e4e7ec; border-radius: 9px;
      background: #fff; overflow: hidden;
      box-shadow: 0 1px 2px rgba(0,0,0,0.05);
      transition: border-color .15s, box-shadow .15s;
    }
    .suffix-wrap:hover:not(:focus-within) { border-color: #c8cfe0; }
    .suffix-wrap:focus-within {
      border-color: #4f6ef7;
      box-shadow: 0 0 0 3px rgba(79,110,247,0.15);
    }
    .suffix-wrap > input {
      border: none; border-radius: 0; box-shadow: none;
      flex: 1; padding: 9px 0 9px 11px; min-width: 0;
    }
    .suffix-wrap > input:focus { box-shadow: none; border: none; }
    .email-suffix-area {
      display: flex; align-items: center;
      border-left: 1.5px solid #e4e7ec; background: #f7f8fc;
      flex-shrink: 0; transition: background .15s, border-color .15s;
    }
    .email-suffix-area.active { background: #f0f4ff; border-left-color: #c7d2fe; }
    .at-sign {
      padding: 9px 2px 9px 8px; font-size: 12px;
      color: #9ca3af; white-space: nowrap; user-select: none;
      transition: color .15s;
    }
    .email-suffix-area.active .at-sign { color: #4f6ef7; }
    .email-suffix-area input {
      border: none; border-radius: 0; box-shadow: none; background: transparent;
      padding: 9px 11px 9px 2px; width: 120px; font-size: 12px;
      color: #9ca3af; transition: color .15s; font-family: inherit;
    }
    .email-suffix-area.active input { color: #4f6ef7; }
    .email-suffix-area input:focus { box-shadow: none; border: none; background: transparent; }
    .email-suffix-area input::placeholder { color: #c0c5d6; }
    .file-drop:focus-visible { outline: 2px solid #4f6ef7; outline-offset: 2px; }

    /* File drop */
    .file-drop {
      position: relative; border: 1.5px dashed #e4e7ec;
      border-radius: 9px; background: #fafafa; cursor: pointer;
      box-shadow: 0 1px 2px rgba(0,0,0,0.04);
      transition: border-color .15s, background .15s;
    }
    .file-drop:hover { border-color: #4f6ef7; background: #f0f4ff; }
    .file-drop.drag-over { border-color: #4f6ef7; background: #e8eeff; }
    .file-drop input[type="file"] {
      position: absolute; inset: 0; width: 100%; height: 100%;
      opacity: 0; cursor: pointer; padding: 0; border: none;
    }
    .drop-inner {
      display: flex; flex-direction: column; align-items: center;
      gap: 4px; padding: 18px 12px; pointer-events: none;
    }
    .upload-icon { color: #b0b8cc; margin-bottom: 2px; }
    .drop-label { font-size: 12.5px; font-weight: 500; color: #6b7280; }
    .drop-hint { font-size: 11px; color: #b0b8cc; }

    /* File preview */
    .file-preview {
      display: flex; align-items: center; gap: 10px;
      padding: 9px 11px; margin-top: 8px;
      background: #fff; border-radius: 9px;
      border: 1.5px solid #e4e7ec;
      box-shadow: 0 1px 2px rgba(0,0,0,0.04);
    }
    .file-preview img {
      width: 36px; height: 36px; object-fit: contain;
      border-radius: 6px; border: 1px solid #e4e7ec; background: #f7f8fc;
      flex-shrink: 0;
    }
    .file-info { flex: 1; overflow: hidden; }
    .file-name { display: block; font-size: 12.5px; font-weight: 500; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .file-size { display: block; font-size: 11px; color: #9ca3af; margin-top: 1px; }
    .remove-file {
      background: none; border: none; color: #c0c5d6;
      width: 24px; height: 24px; border-radius: 6px; cursor: pointer;
      display: flex; align-items: center; justify-content: center;
      flex-shrink: 0; transition: background .15s, color .15s;
    }
    .remove-file:hover { background: #fee2e2; color: #dc2626; }

    .hidden { display: none !important; }

    /* Status */
    .status {
      padding: 9px 12px; border-radius: 8px;
      font-size: 12.5px; font-weight: 500; margin-bottom: 12px;
    }
    .status.success { background: #f0fdf4; color: #15803d; border: 1.5px solid #bbf7d0; }
    .status.error   { background: #fef2f2; color: #b91c1c; border: 1.5px solid #fecaca; }

    /* Actions */
    .actions {
      display: flex; align-items: center; justify-content: space-between;
      padding-top: 14px; margin-top: 6px;
      border-top: 1.5px solid #f0f1f5;
    }
    .reset-btn {
      background: none; border: none; color: #9ca3af;
      font-size: 12.5px; font-weight: 500; cursor: pointer;
      display: flex; align-items: center; gap: 5px;
      padding: 6px 9px; border-radius: 7px; font-family: inherit;
      transition: background .15s, color .15s;
    }
    .reset-btn:hover { background: #f3f4f8; color: #374151; }
    .submit-btn {
      padding: 9px 20px; background: #0f1117; color: #fff;
      border: none; border-radius: 9px; font-size: 13px; font-weight: 600;
      cursor: pointer; display: flex; align-items: center; gap: 7px;
      font-family: inherit; letter-spacing: -0.1px;
      box-shadow: 0 1px 3px rgba(0,0,0,0.2), 0 4px 10px rgba(0,0,0,0.1);
      transition: background .15s, transform .1s, box-shadow .15s;
    }
    .submit-btn:hover { background: #1e2030; }
    .submit-btn:active { transform: translateY(1px); box-shadow: 0 1px 2px rgba(0,0,0,0.15); }
    .submit-btn:disabled { opacity: 0.55; cursor: not-allowed; transform: none; }

    .spinner {
      width: 13px; height: 13px;
      border: 2px solid rgba(255,255,255,0.3);
      border-top-color: #fff; border-radius: 50%;
      animation: spin .65s linear infinite; flex-shrink: 0;
    }
    @keyframes spin { to { transform: rotate(360deg); } }

    /* Image pick button */
    .pick-btn {
      width: 100%; margin-top: 7px;
      padding: 8px 12px; background: none;
      border: 1.5px solid #e4e7ec; border-radius: 9px;
      font-size: 12.5px; font-weight: 500; color: #6b7280;
      cursor: pointer; display: flex; align-items: center;
      justify-content: center; gap: 6px; font-family: inherit;
      transition: border-color .15s, background .15s, color .15s;
    }
    .pick-btn:hover { border-color: #4f6ef7; background: #f0f4ff; color: #4f6ef7; }
  `;

  // ── HTML ─────────────────────────────────────────────────────
  const panel = document.createElement("div");
  panel.id = "lc-panel";
  panel.innerHTML = `
    <div class="titlebar">
      <div class="titlebar-left">
        <svg class="app-logo" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 243.63 53.06" height="18"><defs><style>.cls-1{fill:currentColor;}</style></defs><path class="cls-1" d="M24.28,52.1h-9.92V7.91H0v-3.06h38.8v3.06h-14.52v44.18Z"/><path class="cls-1" d="M70.32,1.27l9.36-1v51.83h-9.36V1.27Z"/><path class="cls-1" d="M135.45,17.54h0l9.36-1v35.56h-9.36V17.54ZM139.85,1.09c2.64,0,4.64,2,4.64,4.72,0,2.56-2,4.72-4.72,4.72-2.4,0-4.48-2.16-4.48-4.8s2.08-4.64,4.48-4.64h.08Z"/><path class="cls-1" d="M243.63,30.02c0-9.12-2.93-13.44-9.57-13.44-3.69,0-8.96,4.22-11.35,7.64h-.54V.32l-8.78.94v50.85h9.36v-21.66c1.17-6.03,6.19-9.39,8.08-9.48,3.34-.17,3.52,1.06,3.52,8.99v22.16h9.28v-22.08Z"/><path class="cls-1" d="M171.93,27.24c-1.68-4.16-3.69-8.26-7.61-8.26-2.56,0-4.32,1.45-4.32,4.41,0,3.12,2.48,5.12,5.68,6.72,5.92,2.96,9.84,5.68,9.84,11.44,0,7.84-7.04,11.52-13.36,11.52-3.84,0-7.6-1.44-9.2-2.32-.48-1.2-1.34-6.68-1.34-10.36l1.86-.39c1.92,5.12,5,10.41,9.8,10.41,2.64,0,4.4-1.18,4.4-3.9s-1.04-4.8-5.68-7.28c-4-2.08-9.6-5.36-9.6-11.36,0-6.32,4.56-11.2,12.72-11.28,3.28-.08,5.44.8,6.96,1.44.72,1.84,1.76,6.92,1.92,8.28l-2.06.94Z"/><path class="cls-1" d="M207.85,43.46c-2.8,2.32-4.15,3.27-8.41,3.27-3.76,0-10.79-3.76-10.79-14.8,0-6.95.2-9.63,3.93-11.49,3.15-1.58,5.62.74,8.72,3.69.64.67,1.55,1.1,2.55,1.1,1.95,0,3.54-1.58,3.54-3.54,0-1.2-.6-2.25-1.51-2.89v-.02c-1.52-1.16-4.46-2.2-6.54-2.2h-.08c-2.5,0-7.17.94-12.13,4.7-5.12,3.76-7.44,9.38-7.44,15.06,0,8.4,6.05,16.72,15.91,16.72,4.96,0,10.36-3.74,13.45-8.07l-1.2-1.52Z"/><path class="cls-1" d="M110.15,52.1h9.23v-21.66c1.05-5,2.39-6.24,3.61-6.58,1.09-.31,1.21,0,2.65.54.45.17.94.28,1.45.28,2.24,0,4.05-1.81,4.05-4.05s-1.81-4.05-4.05-4.05c-3.74,0-5.91,3.8-7.74,7.64h-.55v-7.6s-8.63.92-8.63.92v34.56Z"/><path class="cls-1" d="M89.41,20.06c0-2.32.14-5.56.48-7.4.34-1.79,1.39-6.8,6.6-10.4,2.8-1.94,5.7-2.26,8.2-2.26,2.82,0,4.37.77,5.27,1.47,0,0,0,0,.01,0,.96.63,1.59,1.72,1.59,2.95,0,1.95-1.58,3.54-3.54,3.54-.98,0-1.87-.4-2.51-1.04h0c-2.23-2.26-2.38-5.01-4.91-4.31-2.13.59-2.04,1.66-2.04,3.98v10.86l.08.08h4.52v3.25h-4.52v31.31h-9.22V20.06Z"/><path class="cls-1" d="M35.26,26.71c0,1.95,1.58,3.54,3.54,3.54,1.66,0,3.04-1.15,3.42-2.69h.01c.8-3.04,1.09-4.65,1.74-5.73.75-1.25,2.65-1.99,3.85-2.41,2.96-1.04,3.82,3.22,3.82,8.75v1.71c-1.55,2.73-7.43,4.61-12.17,6.48-3.63,1.43-5.53,4.35-5.53,8.11,0,4.48,3.75,8.57,10.07,8.57,1.52,0,6.01-2.79,8.74-4.63.32.96,1.06,2,2.08,2.89,1.17,1.02,2.65,1.61,3.94,1.61l5.26-3.56-.65-1.7s-.44.18-.84.29c-1.42.39-1.97.08-1.97-3.2v-15.62c0-4.72-.63-7.67-3.6-10.12-1.73-1.43-3.37-2.44-6.41-2.44-2.32,0-7.2,2.2-11.68,5.16-3.43,2.26-3.62,4.2-3.62,4.98ZM51.38,44.23c0,2.95-1.79,3.82-2.72,4.1-3.79,1.18-5.65-1.5-5.29-6.69.17-2.56.87-4.09,4.01-5.6,2.19-1.05,3.56-1.77,4-2.68,0,0,0,6.48,0,10.86Z"/></svg>
      </div>
      <button class="close-btn" id="lc-close" title="Schliessen">
        <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
      </button>
    </div>

    <div class="content">
      <form id="lc-form">
        <div class="field">
          <label for="lc-firma">Firma</label>
          <input type="text" id="lc-firma" placeholder="Firmenname" required />
        </div>
        <div class="field">
          <label for="lc-domain">Domain</label>
          <div class="prefix-wrap">
            <span class="prefix">https://</span>
            <input type="text" id="lc-domain" placeholder="example.com" required />
          </div>
        </div>
        <div class="field">
          <label for="lc-contact">Ansprechpartner</label>
          <input type="text" id="lc-contact" placeholder="Vor- und Nachname" required />
        </div>
        <div class="field">
          <label for="lc-email">E-Mail</label>
          <div class="suffix-wrap">
            <input type="text" id="lc-email" placeholder="name" required />
            <div class="email-suffix-area" id="lc-email-suffix-area">
              <span class="at-sign">@</span>
              <input type="text" id="lc-email-domain" placeholder="domain.com" autocomplete="off" />
            </div>
          </div>
        </div>
        <div class="field">
          <label>Logo</label>
          <div class="file-drop" id="lc-drop" tabindex="0">
            <input type="file" id="lc-file" accept="image/*" />
            <div class="drop-inner">
              <svg class="upload-icon" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
              <span class="drop-label" id="lc-file-label">Bild auswählen oder ablegen</span>
              <span class="drop-hint">PNG, JPG, SVG, WEBP · Strg+V</span>
            </div>
          </div>
          <button type="button" class="pick-btn" id="lc-pick">
            <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="22" y1="12" x2="18" y2="12"/><line x1="6" y1="12" x2="2" y2="12"/><line x1="12" y1="6" x2="12" y2="2"/><line x1="12" y1="22" x2="12" y2="18"/></svg>
            Logo auf Seite auswählen
          </button>
          <div id="lc-preview" class="file-preview hidden"></div>
        </div>

        <div id="lc-status" class="status hidden"></div>

        <div class="actions">
          <button type="button" class="reset-btn" id="lc-reset">
            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>
            Formular löschen
          </button>
          <button type="submit" class="submit-btn" id="lc-submit">
            <span id="lc-btn-text">Absenden</span>
            <span id="lc-spinner" class="spinner hidden"></span>
          </button>
        </div>
      </form>
    </div>
  `;

  shadow.appendChild(style);
  shadow.appendChild(panel);

  // ── Logic ────────────────────────────────────────────────────
  const $ = (id) => shadow.getElementById(id);

  const form = $("lc-form");
  const fileDrop = $("lc-drop");
  const fileInput = $("lc-file");
  const fileLabel = $("lc-file-label");
  const filePreview = $("lc-preview");
  const statusEl = $("lc-status");
  const submitBtn = $("lc-submit");
  const btnText = $("lc-btn-text");
  const spinner = $("lc-spinner");

  let selectedFile = null;

  // Close
  $("lc-close").addEventListener("click", () => {
    panel.style.display = "none";
  });

  // Email domain suffix — auto-syncs with domain field, but remains independently editable
  let userEditedEmailDomain = false;

  function updateEmailSuffixArea() {
    const suffixArea = $("lc-email-suffix-area");
    if ($("lc-email-domain").value.trim()) {
      suffixArea.classList.add("active");
    } else {
      suffixArea.classList.remove("active");
    }
  }

  function syncEmailDomainFromWebDomain() {
    if (!userEditedEmailDomain) {
      $("lc-email-domain").value = $("lc-domain").value.trim();
    }
    updateEmailSuffixArea();
  }

  $("lc-domain").addEventListener("input", syncEmailDomainFromWebDomain);

  $("lc-email-domain").addEventListener("input", () => {
    userEditedEmailDomain = true;
    updateEmailSuffixArea();
  });

  // State persistence via chrome.storage.local
  const fields = ["lc-firma", "lc-domain", "lc-contact", "lc-email", "lc-email-domain"];

  function saveState() {
    const state = {};
    fields.forEach((id) => {
      state[id] = $(id).value;
    });
    chrome.storage.local.set({ [STORAGE_KEY]: state });
  }

  // Derive current page domain (strip www.)
  const pageDomain = window.location.hostname.replace(/^www\./, "");

  chrome.storage.local.get(STORAGE_KEY, (data) => {
    const state = data[STORAGE_KEY];
    if (state) {
      fields.forEach((id) => {
        if (state[id]) $(id).value = state[id];
      });
      // Restore independence flag if user previously set a custom email domain
      if (state["lc-email-domain"] && state["lc-domain"] &&
          state["lc-email-domain"] !== state["lc-domain"]) {
        userEditedEmailDomain = true;
      }
    } else {
      // Auto-fill both domain fields from current page on first open
      $("lc-domain").value = pageDomain;
      $("lc-email-domain").value = pageDomain;
    }
    updateEmailSuffixArea();
  });

  fields.forEach((id) => $(id).addEventListener("input", saveState));

  // File handling
  fileInput.addEventListener("change", () => {
    if (fileInput.files[0]) handleFile(fileInput.files[0]);
  });

  fileDrop.addEventListener("dragover", (e) => {
    e.preventDefault();
    fileDrop.classList.add("drag-over");
  });
  fileDrop.addEventListener("dragleave", () => {
    fileDrop.classList.remove("drag-over");
  });
  fileDrop.addEventListener("drop", (e) => {
    e.preventDefault();
    fileDrop.classList.remove("drag-over");
    if (e.dataTransfer.files[0]) handleFile(e.dataTransfer.files[0]);
  });

  function formatBytes(b) {
    if (b < 1024) return b + " B";
    if (b < 1048576) return (b / 1024).toFixed(1) + " KB";
    return (b / 1048576).toFixed(1) + " MB";
  }

  function handleFile(file) {
    selectedFile = file;
    fileLabel.textContent = file.name;
    const reader = new FileReader();
    reader.onload = (e) => {
      filePreview.innerHTML = `
        <img src="${e.target.result}" alt="Preview" />
        <div class="file-info">
          <span class="file-name">${file.name}</span>
          <span class="file-size">${formatBytes(file.size)}</span>
        </div>
        <button class="remove-file" title="Entfernen">
          <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>`;
      filePreview.classList.remove("hidden");
      filePreview
        .querySelector(".remove-file")
        .addEventListener("click", clearFile);
    };
    reader.readAsDataURL(file);
  }

  function clearFile() {
    selectedFile = null;
    fileInput.value = "";
    fileLabel.textContent = "Bild auswählen oder ablegen";
    filePreview.innerHTML = "";
    filePreview.classList.add("hidden");
  }

  // Paste image from clipboard (Strg+V anywhere while panel is visible)
  document.addEventListener("paste", (e) => {
    if (panel.style.display === "none") return;
    const items = e.clipboardData ? e.clipboardData.items : [];
    for (const item of items) {
      if (item.type.startsWith("image/")) {
        const file = item.getAsFile();
        if (file) handleFile(file);
        break;
      }
    }
  });

  // ── Image pick mode ──────────────────────────────────────────
  let pickActive = false;
  let pickTarget = null;
  let pickOverlay = null;
  let pickBanner = null;
  let pickCursorStyle = null;

  $("lc-pick").addEventListener("click", enterPickMode);

  function enterPickMode() {
    pickActive = true;
    panel.style.display = "none";

    pickCursorStyle = document.createElement("style");
    pickCursorStyle.textContent = "* { cursor: crosshair !important; }";
    document.head.appendChild(pickCursorStyle);

    pickBanner = document.createElement("div");
    pickBanner.style.cssText = "position:fixed;top:0;left:0;right:0;z-index:2147483646;background:#4f6ef7;color:#fff;text-align:center;padding:10px 16px;font-size:13px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;pointer-events:none;box-shadow:0 2px 12px rgba(79,110,247,0.4);";
    pickBanner.textContent = "Klicke auf ein Bild oder Logo auf der Seite  ·  ESC = Abbrechen";
    document.documentElement.appendChild(pickBanner);

    pickOverlay = document.createElement("div");
    pickOverlay.style.cssText = "position:fixed;pointer-events:none;z-index:2147483645;border:2.5px solid #4f6ef7;border-radius:5px;background:rgba(79,110,247,0.12);box-shadow:0 0 0 4px rgba(79,110,247,0.15);display:none;";
    document.documentElement.appendChild(pickOverlay);

    document.addEventListener("mouseover", onPickHover, true);
    document.addEventListener("click", onPickClick, true);
    document.addEventListener("keydown", onPickKeydown, true);
  }

  function exitPickMode(restorePanel = true) {
    pickActive = false;
    if (pickCursorStyle) { pickCursorStyle.remove(); pickCursorStyle = null; }
    if (pickBanner) { pickBanner.remove(); pickBanner = null; }
    if (pickOverlay) { pickOverlay.remove(); pickOverlay = null; }
    document.removeEventListener("mouseover", onPickHover, true);
    document.removeEventListener("click", onPickClick, true);
    document.removeEventListener("keydown", onPickKeydown, true);
    pickTarget = null;
    if (restorePanel) panel.style.display = "";
  }

  function findImageElement(el) {
    let node = el;
    let depth = 0;
    while (node && node.tagName !== "HTML" && depth < 8) {
      const tag = (node.tagName || "").toUpperCase();
      if (tag === "IMG" || tag === "SVG") return node;
      if (tag === "PICTURE") return node.querySelector("img") || node;
      const bg = window.getComputedStyle(node).backgroundImage;
      if (bg && bg !== "none" && bg.startsWith("url(")) return node;
      node = node.parentElement;
      depth++;
    }
    return null;
  }

  function onPickHover(e) {
    if (!pickActive || !pickOverlay) return;
    const found = findImageElement(e.target);
    pickTarget = found;
    if (found) {
      const r = found.getBoundingClientRect();
      Object.assign(pickOverlay.style, {
        display: "block", top: r.top + "px", left: r.left + "px",
        width: r.width + "px", height: r.height + "px",
      });
    } else {
      pickOverlay.style.display = "none";
    }
  }

  function onPickClick(e) {
    if (!pickActive) return;
    const found = findImageElement(e.target);
    if (!found) return;
    e.preventDefault();
    e.stopImmediatePropagation();
    exitPickMode(false);
    captureImageElement(found)
      .then((file) => { if (file) handleFile(file); panel.style.display = ""; })
      .catch(() => { showStatus("Bild konnte nicht geladen werden.", "error"); panel.style.display = ""; });
  }

  function onPickKeydown(e) {
    if (e.key === "Escape") exitPickMode();
  }

  async function captureImageElement(el) {
    const tag = (el.tagName || "").toUpperCase();
    if (tag === "SVG") {
      const str = new XMLSerializer().serializeToString(el);
      const blob = new Blob([str], { type: "image/svg+xml" });
      return new File([blob], "logo.svg", { type: "image/svg+xml" });
    }
    if (tag === "IMG") {
      const src = el.currentSrc || el.src || "";
      if (!src) throw new Error("Keine Bildquelle");
      return await fetchToFile(src);
    }
    const bg = window.getComputedStyle(el).backgroundImage;
    const m = bg.match(/url\(["']?(.+?)["']?\)/);
    if (m) return await fetchToFile(m[1].trim());
    throw new Error("Kein Bild gefunden");
  }

  async function fetchToFile(url) {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const blob = await res.blob();
    const raw = url.split("/").pop().split("?")[0] || "logo";
    const ext = (blob.type.split("/")[1] || "png").replace("svg+xml", "svg");
    const name = /\.\w{2,5}$/.test(raw) ? raw : `${raw}.${ext}`;
    return new File([blob], name, { type: blob.type });
  }

  // Reset
  $("lc-reset").addEventListener("click", () => {
    form.reset();
    clearFile();
    hideStatus();
    userEditedEmailDomain = false;
    updateEmailSuffixArea();
    chrome.storage.local.remove(STORAGE_KEY);
  });

  // Submit
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    hideStatus();
    setLoading(true);
    try {
      const domain = $("lc-domain").value.trim();
      const emailDomain = $("lc-email-domain").value.trim() || domain;
      const emailLocal = $("lc-email").value.trim();
      const fullEmail = emailLocal + "@" + emailDomain;

      if (!selectedFile) {
        showStatus("Bitte ein Logo hochladen.", "error");
        setLoading(false);
        return;
      }

      const fd = new FormData();
      fd.append("firma", $("lc-firma").value.trim());
      fd.append("domain", domain);
      fd.append("ansprechpartner", $("lc-contact").value.trim());
      fd.append("email", fullEmail);
      fd.append("submittedAt", new Date().toISOString());
      fd.append("logo", selectedFile, selectedFile.name);
      fd.append("logoFilename", selectedFile.name);

      const res = await fetch(WEBHOOK_URL, { method: "POST", body: fd });

      if (res.ok) {
        showStatus("Lead erfolgreich gesendet!", "success");
        form.reset();
        clearFile();
        chrome.storage.local.remove(STORAGE_KEY);
      } else {
        showStatus(`Fehler: Server antwortete mit ${res.status}`, "error");
      }
    } catch (err) {
      showStatus(`Fehler beim Senden: ${err.message}`, "error");
    } finally {
      setLoading(false);
    }
  });

  function setLoading(on) {
    submitBtn.disabled = on;
    btnText.textContent = on ? "Wird gesendet…" : "Absenden";
    spinner.classList.toggle("hidden", !on);
  }
  function showStatus(msg, type) {
    statusEl.textContent = msg;
    statusEl.className = `status ${type}`;
    statusEl.classList.remove("hidden");
  }
  function hideStatus() {
    statusEl.classList.add("hidden");
  }
})();
