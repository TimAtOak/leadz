(()=>{const n=document.getElementById("__leadz_root__");if(n){const r=n.shadowRoot.getElementById("lz-panel");r.style.display=r.style.display==="none"?"":"none";return}le()})();function ee(n){const r=/[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}/g;return[...new Set(n.match(r)??[])]}function oe(n){const r=/(?:\+?\d[\d\s\-().]{7,}\d)/g,l=n.match(r)??[];return[...new Set(l.map(d=>d.trim()).filter(d=>d.replace(/\D/g,"").length>=7))]}function te(){var d;const n=document.querySelector('link[rel="apple-touch-icon"]');if(n!=null&&n.href)return n.href;const r=Array.from(document.querySelectorAll('link[rel~="icon"]'));if(r.sort((f,w)=>{const c=t=>{var u;return parseInt(((u=t.getAttribute("sizes"))==null?void 0:u.split("x")[0])??"0")||0};return c(w)-c(f)}),(d=r[0])!=null&&d.href)return r[0].href;const l=document.querySelector('link[rel="shortcut icon"]');return l!=null&&l.href?l.href:`${window.location.origin}/favicon.ico`}function ne(){const n=document.querySelector('meta[property="og:image"]'),r=n==null?void 0:n.getAttribute("content");if(!r)return null;try{return new URL(r,window.location.href).href}catch{return null}}function ie(){const n=['header img[class*="logo"i]','header img[id*="logo"i]','nav img[class*="logo"i]','nav img[id*="logo"i]','a[class*="logo"i] img','a[id*="logo"i] img','[class*="navbar"i] img','img[class*="logo"i]','img[id*="logo"i]','img[alt*="logo"i]'];for(const r of n){const l=document.querySelector(r);if(l!=null&&l.src&&!l.src.startsWith("data:"))return l.src}return null}function G(){var r,l;const n=((r=document.body)==null?void 0:r.innerText)??"";return{url:window.location.href,domain:window.location.hostname.replace(/^www\./,""),title:document.title||null,metaDescription:((l=document.querySelector('meta[name="description"]'))==null?void 0:l.getAttribute("content"))??null,h1Texts:Array.from(document.querySelectorAll("h1")).map(d=>{var f;return((f=d.textContent)==null?void 0:f.trim())??""}).filter(Boolean).slice(0,5),detectedEmails:ee(n),detectedPhones:oe(n),faviconUrl:te(),ogImageUrl:ne(),logoUrl:ie()}}function O(){return new Promise(n=>chrome.storage.local.get("leadz_token",r=>n(r.leadz_token??null)))}function re(n){return new Promise(r=>chrome.storage.local.set({leadz_token:n},r))}function W(){return new Promise(n=>chrome.storage.local.remove("leadz_token",n))}async function T(n,r,l){const d=await O();return new Promise(f=>{chrome.runtime.sendMessage({type:"LEADZ_API",path:n,method:r,body:l,token:d},w=>{f(w??{ok:!1,status:0,data:null})})})}function le(){const n=G(),r="lz_form_state",l="http://localhost:5173",d=document.createElement("div");d.id="__leadz_root__",d.style.cssText="all:initial;position:fixed;top:0;right:0;z-index:2147483647;",document.documentElement.appendChild(d);const f=d.attachShadow({mode:"open"}),w=document.createElement("style");w.textContent=`
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    :host { all: initial; }

    #lz-panel {
      position: fixed; top: 50%; right: 24px; transform: translateY(-50%);
      width: 400px; background: #fff; border-radius: 16px;
      box-shadow: 0 8px 32px rgba(0,0,0,0.18), 0 2px 8px rgba(0,0,0,0.08);
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      font-size: 13px; color: #0f1117; overflow: hidden;
      -webkit-font-smoothing: antialiased; border: 1px solid rgba(0,0,0,0.08);
    }

    .titlebar {
      display: flex; align-items: center; justify-content: space-between;
      padding: 0 14px; height: 46px; background: #fff;
      border-bottom: 1px solid #e4e7ec; user-select: none;
    }
    .titlebar-left { display: flex; align-items: center; gap: 9px; }
    .app-logo { display: block; color: #0f1117; }
    .close-btn {
      width: 28px; height: 28px; border-radius: 7px;
      background: none; border: none; cursor: pointer; color: #9ca3af;
      display: flex; align-items: center; justify-content: center;
      transition: background .15s, color .15s;
    }
    .close-btn:hover { background: #fee2e2; color: #dc2626; }

    .content {
      padding: 18px 18px 16px;
      max-height: calc(100vh - 100px); overflow-y: auto;
    }
    .content::-webkit-scrollbar { width: 5px; }
    .content::-webkit-scrollbar-track { background: transparent; }
    .content::-webkit-scrollbar-thumb { background: #e4e7ec; border-radius: 99px; }

    h2 { font-size: 15px; font-weight: 700; margin-bottom: 14px; }

    .field { margin-bottom: 13px; }
    label {
      display: block; font-size: 11px; font-weight: 600; color: #6b7280;
      text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 5px;
    }

    input[type="text"], input[type="email"], input[type="password"] {
      width: 100%; padding: 9px 11px;
      border: 1.5px solid #e4e7ec; border-radius: 9px;
      font-size: 13px; color: #0f1117; background: #fff;
      outline: none; font-family: inherit;
      box-shadow: 0 1px 2px rgba(0,0,0,0.05);
      transition: border-color .15s, box-shadow .15s;
    }
    input[type="text"]:hover, input[type="email"]:hover, input[type="password"]:hover { border-color: #c8cfe0; }
    input[type="text"]:focus, input[type="email"]:focus, input[type="password"]:focus {
      border-color: #4f6ef7; box-shadow: 0 0 0 3px rgba(79,110,247,0.15);
    }
    input::placeholder { color: #c0c5d6; }

    .prefix-wrap {
      display: flex; align-items: center;
      border: 1.5px solid #e4e7ec; border-radius: 9px;
      background: #fff; overflow: hidden; box-shadow: 0 1px 2px rgba(0,0,0,0.05);
      transition: border-color .15s, box-shadow .15s;
    }
    .prefix-wrap:hover:not(:focus-within) { border-color: #c8cfe0; }
    .prefix-wrap:focus-within { border-color: #4f6ef7; box-shadow: 0 0 0 3px rgba(79,110,247,0.15); }
    .prefix {
      padding: 9px 9px 9px 11px; font-size: 12px; color: #9ca3af;
      background: #f7f8fc; border-right: 1.5px solid #e4e7ec; white-space: nowrap; user-select: none;
    }
    .prefix-wrap input { border: none; border-radius: 0; box-shadow: none; flex: 1; padding-left: 9px; }
    .prefix-wrap input:focus { box-shadow: none; border: none; }

    .suffix-wrap {
      display: flex; align-items: center;
      border: 1.5px solid #e4e7ec; border-radius: 9px;
      background: #fff; overflow: hidden; box-shadow: 0 1px 2px rgba(0,0,0,0.05);
      transition: border-color .15s, box-shadow .15s;
    }
    .suffix-wrap:hover:not(:focus-within) { border-color: #c8cfe0; }
    .suffix-wrap:focus-within { border-color: #4f6ef7; box-shadow: 0 0 0 3px rgba(79,110,247,0.15); }
    .suffix-wrap > input { border: none; border-radius: 0; box-shadow: none; flex: 1; padding: 9px 0 9px 11px; min-width: 0; }
    .suffix-wrap > input:focus { box-shadow: none; border: none; }
    .email-suffix-area {
      display: flex; align-items: center; border-left: 1.5px solid #e4e7ec;
      background: #f7f8fc; flex-shrink: 0; transition: background .15s, border-color .15s;
    }
    .email-suffix-area.active { background: #f0f4ff; border-left-color: #c7d2fe; }
    .at-sign { padding: 9px 2px 9px 8px; font-size: 12px; color: #9ca3af; user-select: none; transition: color .15s; }
    .email-suffix-area.active .at-sign { color: #4f6ef7; }
    .email-suffix-area input {
      border: none; border-radius: 0; box-shadow: none; background: transparent;
      padding: 9px 11px 9px 2px; width: 120px; font-size: 12px; color: #9ca3af;
      transition: color .15s; font-family: inherit;
    }
    .email-suffix-area.active input { color: #4f6ef7; }
    .email-suffix-area input:focus { box-shadow: none; border: none; background: transparent; }
    .email-suffix-area input::placeholder { color: #c0c5d6; }

    .file-drop {
      position: relative; border: 1.5px dashed #e4e7ec; border-radius: 9px;
      background: #fafafa; cursor: pointer; box-shadow: 0 1px 2px rgba(0,0,0,0.04);
      transition: border-color .15s, background .15s;
    }
    .file-drop:hover { border-color: #4f6ef7; background: #f0f4ff; }
    .file-drop.drag-over { border-color: #4f6ef7; background: #e8eeff; }
    .file-drop input[type="file"] { position: absolute; inset: 0; width: 100%; height: 100%; opacity: 0; cursor: pointer; padding: 0; border: none; }
    .drop-inner { display: flex; flex-direction: column; align-items: center; gap: 4px; padding: 18px 12px; pointer-events: none; }
    .upload-icon { color: #b0b8cc; margin-bottom: 2px; }
    .drop-label { font-size: 12.5px; font-weight: 500; color: #6b7280; }
    .drop-hint { font-size: 11px; color: #b0b8cc; }

    .file-preview {
      display: flex; align-items: center; gap: 10px; padding: 9px 11px; margin-top: 8px;
      background: #fff; border-radius: 9px; border: 1.5px solid #e4e7ec; box-shadow: 0 1px 2px rgba(0,0,0,0.04);
    }
    .file-preview img { width: 36px; height: 36px; object-fit: contain; border-radius: 6px; border: 1px solid #e4e7ec; background: #f7f8fc; flex-shrink: 0; }
    .file-info { flex: 1; overflow: hidden; }
    .file-name { display: block; font-size: 12.5px; font-weight: 500; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .file-size { display: block; font-size: 11px; color: #9ca3af; margin-top: 1px; }
    .remove-file {
      background: none; border: none; color: #c0c5d6; width: 24px; height: 24px;
      border-radius: 6px; cursor: pointer; display: flex; align-items: center;
      justify-content: center; flex-shrink: 0; transition: background .15s, color .15s;
    }
    .remove-file:hover { background: #fee2e2; color: #dc2626; }

    .pick-btn {
      width: 100%; margin-top: 7px; padding: 8px 12px; background: none;
      border: 1.5px solid #e4e7ec; border-radius: 9px; font-size: 12.5px;
      font-weight: 500; color: #6b7280; cursor: pointer; display: flex;
      align-items: center; justify-content: center; gap: 6px; font-family: inherit;
      transition: border-color .15s, background .15s, color .15s;
    }
    .pick-btn:hover { border-color: #4f6ef7; background: #f0f4ff; color: #4f6ef7; }

    .alert {
      padding: 9px 12px; border-radius: 8px; font-size: 12.5px;
      font-weight: 500; margin-bottom: 12px;
    }
    .alert.success { background: #f0fdf4; color: #15803d; border: 1.5px solid #bbf7d0; }
    .alert.error   { background: #fef2f2; color: #b91c1c; border: 1.5px solid #fecaca; }

    .actions {
      display: flex; align-items: center; justify-content: space-between;
      padding-top: 14px; margin-top: 6px; border-top: 1.5px solid #f0f1f5;
    }
    .reset-btn {
      background: none; border: none; color: #9ca3af; font-size: 12.5px;
      font-weight: 500; cursor: pointer; display: flex; align-items: center;
      gap: 5px; padding: 6px 9px; border-radius: 7px; font-family: inherit;
      transition: background .15s, color .15s;
    }
    .reset-btn:hover { background: #f3f4f8; color: #374151; }
    .submit-btn {
      padding: 9px 20px; background: #0f1117; color: #fff; border: none;
      border-radius: 9px; font-size: 13px; font-weight: 600; cursor: pointer;
      display: flex; align-items: center; gap: 7px; font-family: inherit;
      box-shadow: 0 1px 3px rgba(0,0,0,0.2), 0 4px 10px rgba(0,0,0,0.1);
      transition: background .15s, transform .1s, box-shadow .15s;
    }
    .submit-btn:hover { background: #1e2030; }
    .submit-btn:active { transform: translateY(1px); box-shadow: 0 1px 2px rgba(0,0,0,0.15); }
    .submit-btn:disabled { opacity: 0.55; cursor: not-allowed; transform: none; }

    .spinner {
      width: 13px; height: 13px; border: 2px solid rgba(255,255,255,0.3);
      border-top-color: #fff; border-radius: 50%;
      animation: spin .65s linear infinite; flex-shrink: 0;
    }
    @keyframes spin { to { transform: rotate(360deg); } }

    .hidden { display: none !important; }

    .success-box { text-align: center; padding: 8px 0 4px; }
    .success-icon { font-size: 36px; margin-bottom: 10px; }
    .success-box h2 { font-size: 16px; font-weight: 700; margin-bottom: 6px; }
    .success-box p { font-size: 12.5px; color: #6b7280; margin-bottom: 16px; }
    .dashboard-link {
      display: block; padding: 9px 20px; background: #4f6ef7; color: #fff;
      border-radius: 9px; font-size: 13px; font-weight: 600; text-decoration: none;
      text-align: center; margin-bottom: 8px;
      transition: background .15s;
    }
    .dashboard-link:hover { background: #3b5be8; }
    .another-btn {
      width: 100%; padding: 8px; background: none; border: 1.5px solid #e4e7ec;
      border-radius: 9px; font-size: 12.5px; color: #6b7280; cursor: pointer;
      font-family: inherit; font-weight: 500; transition: border-color .15s, background .15s;
    }
    .another-btn:hover { border-color: #c8cfe0; background: #f7f8fc; }

    .logout-link {
      display: block; text-align: center; font-size: 11px; color: #c0c5d6;
      background: none; border: none; cursor: pointer; font-family: inherit;
      margin-top: 10px; text-decoration: underline; padding: 0;
    }
    .logout-link:hover { color: #9ca3af; }
  `;const c=document.createElement("div");c.id="lz-panel",c.innerHTML=`
    <div class="titlebar">
      <div class="titlebar-left">
        <svg class="app-logo" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 243.63 53.06" height="18"><defs><style>.cls-1{fill:currentColor;}</style></defs><path class="cls-1" d="M24.28,52.1h-9.92V7.91H0v-3.06h38.8v3.06h-14.52v44.18Z"/><path class="cls-1" d="M70.32,1.27l9.36-1v51.83h-9.36V1.27Z"/><path class="cls-1" d="M135.45,17.54h0l9.36-1v35.56h-9.36V17.54ZM139.85,1.09c2.64,0,4.64,2,4.64,4.72,0,2.56-2,4.72-4.72,4.72-2.4,0-4.48-2.16-4.48-4.8s2.08-4.64,4.48-4.64h.08Z"/><path class="cls-1" d="M243.63,30.02c0-9.12-2.93-13.44-9.57-13.44-3.69,0-8.96,4.22-11.35,7.64h-.54V.32l-8.78.94v50.85h9.36v-21.66c1.17-6.03,6.19-9.39,8.08-9.48,3.34-.17,3.52,1.06,3.52,8.99v22.16h9.28v-22.08Z"/><path class="cls-1" d="M171.93,27.24c-1.68-4.16-3.69-8.26-7.61-8.26-2.56,0-4.32,1.45-4.32,4.41,0,3.12,2.48,5.12,5.68,6.72,5.92,2.96,9.84,5.68,9.84,11.44,0,7.84-7.04,11.52-13.36,11.52-3.84,0-7.6-1.44-9.2-2.32-.48-1.2-1.34-6.68-1.34-10.36l1.86-.39c1.92,5.12,5,10.41,9.8,10.41,2.64,0,4.4-1.18,4.4-3.9s-1.04-4.8-5.68-7.28c-4-2.08-9.6-5.36-9.6-11.36,0-6.32,4.56-11.2,12.72-11.28,3.28-.08,5.44.8,6.96,1.44.72,1.84,1.76,6.92,1.92,8.28l-2.06.94Z"/><path class="cls-1" d="M207.85,43.46c-2.8,2.32-4.15,3.27-8.41,3.27-3.76,0-10.79-3.76-10.79-14.8,0-6.95.2-9.63,3.93-11.49,3.15-1.58,5.62.74,8.72,3.69.64.67,1.55,1.1,2.55,1.1,1.95,0,3.54-1.58,3.54-3.54,0-1.2-.6-2.25-1.51-2.89v-.02c-1.52-1.16-4.46-2.2-6.54-2.2h-.08c-2.5,0-7.17.94-12.13,4.7-5.12,3.76-7.44,9.38-7.44,15.06,0,8.4,6.05,16.72,15.91,16.72,4.96,0,10.36-3.74,13.45-8.07l-1.2-1.52Z"/><path class="cls-1" d="M110.15,52.1h9.23v-21.66c1.05-5,2.39-6.24,3.61-6.58,1.09-.31,1.21,0,2.65.54.45.17.94.28,1.45.28,2.24,0,4.05-1.81,4.05-4.05s-1.81-4.05-4.05-4.05c-3.74,0-5.91,3.8-7.74,7.64h-.55v-7.6s-8.63.92-8.63.92v34.56Z"/><path class="cls-1" d="M89.41,20.06c0-2.32.14-5.56.48-7.4.34-1.79,1.39-6.8,6.6-10.4,2.8-1.94,5.7-2.26,8.2-2.26,2.82,0,4.37.77,5.27,1.47,0,0,0,0,.01,0,.96.63,1.59,1.72,1.59,2.95,0,1.95-1.58,3.54-3.54,3.54-.98,0-1.87-.4-2.51-1.04h0c-2.23-2.26-2.38-5.01-4.91-4.31-2.13.59-2.04,1.66-2.04,3.98v10.86l.08.08h4.52v3.25h-4.52v31.31h-9.22V20.06Z"/><path class="cls-1" d="M35.26,26.71c0,1.95,1.58,3.54,3.54,3.54,1.66,0,3.04-1.15,3.42-2.69h.01c.8-3.04,1.09-4.65,1.74-5.73.75-1.25,2.65-1.99,3.85-2.41,2.96-1.04,3.82,3.22,3.82,8.75v1.71c-1.55,2.73-7.43,4.61-12.17,6.48-3.63,1.43-5.53,4.35-5.53,8.11,0,4.48,3.75,8.57,10.07,8.57,1.52,0,6.01-2.79,8.74-4.63.32.96,1.06,2,2.08,2.89,1.17,1.02,2.65,1.61,3.94,1.61l5.26-3.56-.65-1.7s-.44.18-.84.29c-1.42.39-1.97.08-1.97-3.2v-15.62c0-4.72-.63-7.67-3.6-10.12-1.73-1.43-3.37-2.44-6.41-2.44-2.32,0-7.2,2.2-11.68,5.16-3.43,2.26-3.62,4.2-3.62,4.98ZM51.38,44.23c0,2.95-1.79,3.82-2.72,4.1-3.79,1.18-5.65-1.5-5.29-6.69.17-2.56.87-4.09,4.01-5.6,2.19-1.05,3.56-1.77,4-2.68,0,0,0,6.48,0,10.86Z"/></svg>
      </div>
      <button class="close-btn" id="lz-close" title="Schliessen">
        <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
      </button>
    </div>

    <!-- Login view -->
    <div id="lz-login" class="content">
      <h2>Anmelden</h2>
      <div id="lz-login-error" class="alert error hidden"></div>
      <form id="lz-login-form">
        <div class="field">
          <label for="lz-l-email">E-Mail</label>
          <input type="email" id="lz-l-email" placeholder="name@example.com" required />
        </div>
        <div class="field">
          <label for="lz-l-password">Passwort</label>
          <input type="password" id="lz-l-password" placeholder="••••••••" required />
        </div>
        <div class="actions" style="border-top:none;padding-top:4px;justify-content:flex-end;">
          <button type="submit" class="submit-btn" id="lz-login-btn">
            <span id="lz-login-btn-text">Anmelden</span>
            <span id="lz-login-spinner" class="spinner hidden"></span>
          </button>
        </div>
      </form>
    </div>

    <!-- Lead form view -->
    <div id="lz-form-view" class="content hidden">
      <div id="lz-form-error" class="alert error hidden"></div>
      <form id="lz-form">
        <div class="field">
          <label for="lz-firma">Firma</label>
          <input type="text" id="lz-firma" placeholder="Firmenname" />
        </div>
        <div class="field">
          <label for="lz-domain">Domain</label>
          <div class="prefix-wrap">
            <span class="prefix">https://</span>
            <input type="text" id="lz-domain" placeholder="example.com" required />
          </div>
        </div>
        <div class="field">
          <label for="lz-contact">Ansprechpartner</label>
          <input type="text" id="lz-contact" placeholder="Vor- und Nachname" />
        </div>
        <div class="field">
          <label for="lz-email">E-Mail</label>
          <div class="suffix-wrap">
            <input type="text" id="lz-email" placeholder="name" />
            <div class="email-suffix-area" id="lz-email-suffix-area">
              <span class="at-sign">@</span>
              <input type="text" id="lz-email-domain" placeholder="domain.com" autocomplete="off" />
            </div>
          </div>
        </div>
        <div class="field">
          <label>Logo</label>
          <div class="file-drop" id="lz-drop">
            <input type="file" id="lz-file" accept="image/*" />
            <div class="drop-inner">
              <svg class="upload-icon" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
              <span class="drop-label" id="lz-file-label">Bild auswählen oder ablegen</span>
              <span class="drop-hint">PNG, JPG, SVG, WEBP · Strg+V</span>
            </div>
          </div>
          <button type="button" class="pick-btn" id="lz-pick">
            <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="22" y1="12" x2="18" y2="12"/><line x1="6" y1="12" x2="2" y2="12"/><line x1="12" y1="6" x2="12" y2="2"/><line x1="12" y1="22" x2="12" y2="18"/></svg>
            Logo auf Seite auswählen
          </button>
          <div id="lz-preview" class="file-preview hidden"></div>
        </div>

        <div class="actions">
          <button type="button" class="reset-btn" id="lz-reset">
            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>
            Zurücksetzen
          </button>
          <button type="submit" class="submit-btn" id="lz-submit">
            <span id="lz-submit-text">Als Lead speichern</span>
            <span id="lz-submit-spinner" class="spinner hidden"></span>
          </button>
        </div>
      </form>
      <button class="logout-link" id="lz-logout">Abmelden</button>
    </div>

    <!-- Success view -->
    <div id="lz-success" class="content hidden">
      <div class="success-box">
        <div class="success-icon">✓</div>
        <h2>Lead gespeichert!</h2>
        <p id="lz-success-domain"></p>
        <a id="lz-dashboard-link" class="dashboard-link" href="#" target="_blank">Im Dashboard öffnen →</a>
        <button class="another-btn" id="lz-another">Weiteren Lead erfassen</button>
      </div>
    </div>
  `,f.appendChild(w),f.appendChild(c);const t=e=>f.getElementById(e);function u(e){for(const o of["lz-login","lz-form-view","lz-success"])t(o).classList.toggle("hidden",o!==e)}function I(e){const o=t("lz-login-btn");o.disabled=e,t("lz-login-btn-text").textContent=e?"Wird angemeldet…":"Anmelden",t("lz-login-spinner").classList.toggle("hidden",!e)}function P(e){const o=t("lz-submit");o.disabled=e,t("lz-submit-text").textContent=e?"Wird gespeichert…":"Als Lead speichern",t("lz-submit-spinner").classList.toggle("hidden",!e)}t("lz-close").addEventListener("click",()=>{c.style.display="none"}),O().then(e=>{e?(u("lz-form-view"),D()):u("lz-login")}),t("lz-login-form").addEventListener("submit",async e=>{var s;e.preventDefault(),t("lz-login-error").classList.add("hidden"),I(!0);const o=t("lz-l-email").value.trim(),i=t("lz-l-password").value,a=await T("/auth/login","POST",{email:o,password:i});if(I(!1),a.ok&&((s=a.data)!=null&&s.token))await re(a.data.token),u("lz-form-view"),D();else{const g=t("lz-login-error");g.textContent="Ungültige Anmeldedaten",g.classList.remove("hidden")}}),t("lz-logout").addEventListener("click",async()=>{await W(),u("lz-login")});let k=null;function D(){chrome.storage.local.get(r,e=>{const o=e[r],i=n.domain;if(o)o["lz-firma"]&&(t("lz-firma").value=o["lz-firma"]),o["lz-domain"]&&(t("lz-domain").value=o["lz-domain"]),o["lz-contact"]&&(t("lz-contact").value=o["lz-contact"]),o["lz-email"]&&(t("lz-email").value=o["lz-email"]),o["lz-email-domain"]&&(t("lz-email-domain").value=o["lz-email-domain"]),o["lz-email-domain"]&&o["lz-domain"]&&o["lz-email-domain"]!==o["lz-domain"]&&(z=!0);else if(t("lz-domain").value=i,n.detectedEmails.length>0){const[s,...g]=n.detectedEmails[0].split("@");t("lz-email").value=s,t("lz-email-domain").value=g.join("@")||i,z=!0}else t("lz-email-domain").value=i;L();const a=n.logoUrl||n.faviconUrl;a&&!(o!=null&&o["lz-firma"])&&(Z(a,"Erkanntes Logo"),k=a)})}let z=!1;function L(){const e=t("lz-email-suffix-area");t("lz-email-domain").value.trim()?e.classList.add("active"):e.classList.remove("active")}t("lz-domain").addEventListener("input",()=>{z||(t("lz-email-domain").value=t("lz-domain").value.trim()),L(),U()}),t("lz-email-domain").addEventListener("input",()=>{z=!0,L(),U()});const _=["lz-firma","lz-domain","lz-contact","lz-email","lz-email-domain"];function U(){const e={};_.forEach(o=>{e[o]=t(`${o}`).value}),chrome.storage.local.set({[r]:e})}_.forEach(e=>t(`${e}`).addEventListener("input",U));const E=t("lz-file"),y=t("lz-drop"),F=t("lz-file-label"),x=t("lz-preview");E.addEventListener("change",()=>{var e;(e=E.files)!=null&&e[0]&&S(E.files[0])}),y.addEventListener("dragover",e=>{e.preventDefault(),y.classList.add("drag-over")}),y.addEventListener("dragleave",()=>y.classList.remove("drag-over")),y.addEventListener("drop",e=>{var o;e.preventDefault(),y.classList.remove("drag-over"),(o=e.dataTransfer)!=null&&o.files[0]&&S(e.dataTransfer.files[0])}),document.addEventListener("paste",e=>{var i;if(c.style.display==="none")return;const o=((i=e.clipboardData)==null?void 0:i.items)??[];for(const a of Array.from(o))if(a.type.startsWith("image/")){const s=a.getAsFile();if(s){S(s);break}}});function K(e){return e<1024?e+" B":e<1048576?(e/1024).toFixed(1)+" KB":(e/1048576).toFixed(1)+" MB"}function S(e){k=null,F.textContent=e.name;const o=new FileReader;o.onload=i=>{Y(i.target.result,e.name,K(e.size))},o.readAsDataURL(e)}function Y(e,o,i){x.innerHTML=`
      <img src="${e}" alt="Preview" />
      <div class="file-info">
        <span class="file-name">${o}</span>
        <span class="file-size">${i}</span>
      </div>
      <button class="remove-file" title="Entfernen">
        <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
      </button>`,x.classList.remove("hidden"),x.querySelector(".remove-file").addEventListener("click",C)}function Z(e,o){var i;x.innerHTML=`
      <img src="${e}" alt="Logo" />
      <div class="file-info">
        <span class="file-name">${o}</span>
        <span class="file-size">${((i=e.split("/").pop())==null?void 0:i.split("?")[0])??""}</span>
      </div>
      <button class="remove-file" title="Entfernen">
        <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
      </button>`,x.classList.remove("hidden"),x.querySelector(".remove-file").addEventListener("click",C)}function C(){k=null,E.value="",F.textContent="Bild auswählen oder ablegen",x.innerHTML="",x.classList.add("hidden")}let A=!1,m=null,b=null,h=null;t("lz-pick").addEventListener("click",J);function J(){A=!0,c.style.display="none",h=document.createElement("style"),h.textContent="* { cursor: crosshair !important; }",document.head.appendChild(h),b=document.createElement("div"),b.style.cssText='position:fixed;top:0;left:0;right:0;z-index:2147483646;background:#4f6ef7;color:#fff;text-align:center;padding:10px 16px;font-size:13px;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;pointer-events:none;box-shadow:0 2px 12px rgba(79,110,247,0.4);',b.textContent="Klicke auf ein Bild oder Logo auf der Seite  ·  ESC = Abbrechen",document.documentElement.appendChild(b),m=document.createElement("div"),m.style.cssText="position:fixed;pointer-events:none;z-index:2147483645;border:2.5px solid #4f6ef7;border-radius:5px;background:rgba(79,110,247,0.12);box-shadow:0 0 0 4px rgba(79,110,247,0.15);display:none;",document.documentElement.appendChild(m),document.addEventListener("mouseover",q,!0),document.addEventListener("click",R,!0),document.addEventListener("keydown",V,!0)}function $(e=!0){A=!1,h==null||h.remove(),h=null,b==null||b.remove(),b=null,m==null||m.remove(),m=null,document.removeEventListener("mouseover",q,!0),document.removeEventListener("click",R,!0),document.removeEventListener("keydown",V,!0),e&&(c.style.display="")}function j(e){let o=e;for(let i=0;o&&o.tagName!=="HTML"&&i<8;i++,o=o.parentElement){const a=o.tagName.toUpperCase();if(a==="IMG"||a==="SVG")return o;if(a==="PICTURE")return o.querySelector("img")||o;const s=window.getComputedStyle(o).backgroundImage;if(s&&s!=="none"&&s.startsWith("url("))return o}return null}function q(e){if(!A||!m)return;const o=j(e.target);if(o){const i=o.getBoundingClientRect();Object.assign(m.style,{display:"block",top:i.top+"px",left:i.left+"px",width:i.width+"px",height:i.height+"px"})}else m.style.display="none"}function R(e){if(!A)return;const o=j(e.target);o&&(e.preventDefault(),e.stopImmediatePropagation(),$(!1),X(o).then(i=>{i.url?(k=i.url,Z(i.url,i.name)):i.file&&S(i.file),c.style.display=""}).catch(()=>{c.style.display=""}))}function V(e){e.key==="Escape"&&$()}async function X(e){var s,g;const o=e.tagName.toUpperCase();if(o==="SVG"){const p=new XMLSerializer().serializeToString(e),v=new Blob([p],{type:"image/svg+xml"});return{file:new File([v],"logo.svg",{type:"image/svg+xml"}),name:"logo.svg"}}if(o==="IMG"){const p=e.currentSrc||e.src||"";if(!p)throw new Error("No src");const v=((s=p.split("/").pop())==null?void 0:s.split("?")[0])||"logo";return{url:p,name:v}}const a=window.getComputedStyle(e).backgroundImage.match(/url\(["']?(.+?)["']?\)/);if(a){const p=a[1].trim(),v=((g=p.split("/").pop())==null?void 0:g.split("?")[0])||"logo";return{url:p,name:v}}throw new Error("No image found")}t("lz-reset").addEventListener("click",()=>{t("lz-firma").value="",t("lz-domain").value=n.domain,t("lz-contact").value="",t("lz-email").value="",t("lz-email-domain").value=n.domain,z=!1,C(),t("lz-form-error").classList.add("hidden"),L(),chrome.storage.local.remove(r)}),t("lz-form").addEventListener("submit",async e=>{var H;e.preventDefault(),t("lz-form-error").classList.add("hidden"),P(!0);const o=t("lz-domain").value.trim()||n.domain,i=t("lz-email").value.trim(),a=t("lz-email-domain").value.trim()||o,s=i?`${i}@${a}`:n.detectedEmails[0]??null,g=t("lz-firma").value.trim()||null,p=t("lz-contact").value.trim()||null,v=k??n.logoUrl??n.faviconUrl??null,B=await T("/leads","POST",{url:n.url,domain:o,title:n.title,companyName:g,metaDescription:n.metaDescription,h1Texts:n.h1Texts,detectedEmails:n.detectedEmails,detectedPhones:n.detectedPhones,faviconUrl:n.faviconUrl,ogImageUrl:n.ogImageUrl,logoUrl:v});if(!B.ok){if(P(!1),B.status===401)await W(),u("lz-login");else{const N=t("lz-form-error");N.textContent="Fehler beim Speichern. Bitte erneut versuchen.",N.classList.remove("hidden")}return}const M=(H=B.data)==null?void 0:H.id;M&&(s||p)&&await T(`/leads/${M}`,"PATCH",{...s?{contactEmail:s}:{},...p?{contactName:p}:{}}),P(!1),chrome.storage.local.remove(r),t("lz-success-domain").textContent=o;const Q=t("lz-dashboard-link");Q.href=M?`${l}/leads/${M}`:`${l}/dashboard`,u("lz-success")}),t("lz-another").addEventListener("click",()=>{C(),z=!1,t("lz-firma").value="",t("lz-contact").value="",t("lz-email").value="";const e=G();t("lz-domain").value=e.domain,t("lz-email-domain").value=e.domain,L(),t("lz-form-error").classList.add("hidden"),u("lz-form-view")})}
