/**
 * Forgio Widget v0.1.0
 * The AI pre-sales engineer that drops into any industrial business website.
 *
 * Usage:
 *   <script
 *     src="https://widget.forgio.co.uk/v1.js"
 *     data-api-url="https://api.forgio.co.uk"
 *     data-tenant="your-tenant-id"
 *   ></script>
 *
 * Optional data attributes:
 *   data-position="bottom-right" | "bottom-left"  (default: bottom-right)
 *   data-launcher-text="Start your enquiry"       (default shown above)
 *   data-color="#FF6B35"                          (override accent colour)
 *
 * The widget mounts itself automatically when the script loads.
 */

(function () {
  'use strict';

  // ---------- Config ----------
  const SCRIPT = document.currentScript;
  const CONFIG = {
    apiUrl: (SCRIPT?.dataset.apiUrl || 'http://localhost:3000').replace(/\/$/, ''),
    tenant: SCRIPT?.dataset.tenant || 'default',
    template: SCRIPT?.dataset.template || 'conveyors',
    demo: SCRIPT?.dataset.demo === 'true',
    allowUploads: SCRIPT?.dataset.allowUploads !== 'false',
    position: SCRIPT?.dataset.position || 'bottom-right',
    launcherText: SCRIPT?.dataset.launcherText || 'Start your enquiry',
    color: SCRIPT?.dataset.color || '#FF6B35',
  };

  // If demo mode is on, file uploads are disabled regardless of allowUploads
  if (CONFIG.demo) CONFIG.allowUploads = false;

  // Prevent double-mount
  if (window.__forgioWidgetMounted) return;
  window.__forgioWidgetMounted = true;

  // ---------- Generate session ID ----------
  function uuid() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      const r = (Math.random() * 16) | 0;
      const v = c === 'x' ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  }
  const SESSION_ID = uuid();

  // ---------- Create host element + shadow DOM ----------
  const host = document.createElement('div');
  host.id = 'forgio-widget-host';
  host.style.cssText = 'position: fixed; z-index: 2147483640; bottom: 0; right: 0;';
  document.body.appendChild(host);

  const shadow = host.attachShadow({ mode: 'open' });

  // ---------- Inject fonts into the main document ----------
  // Fonts can't load inside shadow DOM, so we inject them globally.
  if (!document.getElementById('forgio-fonts')) {
    const link = document.createElement('link');
    link.id = 'forgio-fonts';
    link.rel = 'stylesheet';
    link.href =
      'https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght,SOFT@9..144,300..700,30..100&family=Geist:wght@300..600&display=swap';
    document.head.appendChild(link);
  }

  // ---------- Styles ----------
  const POS_BR = CONFIG.position === 'bottom-left' ? 'left: 24px;' : 'right: 24px;';
  const PANEL_POS = CONFIG.position === 'bottom-left' ? 'left: 24px;' : 'right: 24px;';

  const styles = `
    :host {
      all: initial;
      font-family: 'Geist', -apple-system, BlinkMacSystemFont, system-ui, sans-serif;
    }

    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    button { font-family: inherit; cursor: pointer; border: none; background: none; color: inherit; }

    /* ---------- Launcher ---------- */
    .launcher {
      position: fixed;
      bottom: 24px;
      ${POS_BR}
      background: #0A0A0A;
      color: #F5F1EB;
      border-radius: 999px;
      padding: 14px 22px 14px 18px;
      display: flex;
      align-items: center;
      gap: 10px;
      font-size: 14px;
      font-weight: 500;
      box-shadow: 0 10px 40px rgba(0, 0, 0, 0.25), 0 4px 12px rgba(0, 0, 0, 0.15);
      transition: transform 0.25s cubic-bezier(0.2, 0.8, 0.2, 1), box-shadow 0.25s;
      z-index: 1;
      letter-spacing: -0.005em;
    }
    .launcher:hover {
      transform: translateY(-2px);
      box-shadow: 0 16px 48px rgba(0, 0, 0, 0.35), 0 6px 18px rgba(0, 0, 0, 0.2);
    }
    .launcher-dot {
      width: 10px;
      height: 10px;
      background: ${CONFIG.color};
      border-radius: 50%;
      box-shadow: 0 0 0 0 ${CONFIG.color}66;
      animation: pulse 2.4s ease-out infinite;
    }
    @keyframes pulse {
      0% { box-shadow: 0 0 0 0 ${CONFIG.color}80; }
      70% { box-shadow: 0 0 0 10px ${CONFIG.color}00; }
      100% { box-shadow: 0 0 0 0 ${CONFIG.color}00; }
    }

    /* ---------- Panel ---------- */
    .panel {
      position: fixed;
      bottom: 24px;
      ${PANEL_POS}
      width: 400px;
      height: 640px;
      max-height: calc(100vh - 48px);
      background: #0A0A0A;
      color: #F5F1EB;
      border-radius: 20px;
      overflow: hidden;
      overscroll-behavior: contain;
      display: flex;
      flex-direction: column;
      box-shadow: 0 24px 80px rgba(0, 0, 0, 0.5), 0 8px 32px rgba(0, 0, 0, 0.3);
      transform-origin: bottom right;
      animation: slide-up 0.35s cubic-bezier(0.2, 0.9, 0.2, 1);
      z-index: 2;
      border: 1px solid #1F1F1F;
      transition: all 0.3s cubic-bezier(0.2, 0.9, 0.2, 1);
    }
    .panel.fullscreen {
      width: 100vw !important;
      height: 100vh !important;
      max-height: 100vh !important;
      bottom: 0 !important;
      right: 0 !important;
      left: 0 !important;
      top: 0 !important;
      border-radius: 0 !important;
    }
    .expand-btn {
      background: none;
      border: none;
      color: #8B857B;
      cursor: pointer;
      padding: 4px;
      border-radius: 6px;
      transition: color 0.2s;
      display: flex;
      align-items: center;
    }
    .expand-btn:hover { color: #F5F1EB; }
    @keyframes slide-up {
      from { opacity: 0; transform: translateY(20px) scale(0.96); }
      to { opacity: 1; transform: translateY(0) scale(1); }
    }
    @media (max-width: 520px) {
      .panel {
        width: 100vw;
        height: 100vh;
        max-height: 100vh;
        bottom: 0;
        right: 0;
        left: 0;
        border-radius: 0;
        animation: slide-up-mobile 0.3s cubic-bezier(0.2, 0.9, 0.2, 1);
      }
      @keyframes slide-up-mobile {
        from { transform: translateY(100%); }
        to { transform: translateY(0); }
      }
    }

    /* ---------- Header ---------- */
    .header {
      padding: 18px 20px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-bottom: 1px solid #1F1F1F;
      background: #0A0A0A;
      flex-shrink: 0;
    }
    .brand {
      display: flex;
      align-items: center;
      gap: 8px;
      font-family: 'Fraunces', Georgia, serif;
      font-size: 17px;
      font-weight: 500;
      letter-spacing: -0.015em;
    }
    .brand-dot {
      width: 7px;
      height: 7px;
      background: ${CONFIG.color};
      border-radius: 50%;
      box-shadow: 0 0 8px ${CONFIG.color}aa;
    }
    .close-btn {
      width: 32px;
      height: 32px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 8px;
      color: #8B857B;
      transition: background 0.15s, color 0.15s;
    }
    .close-btn:hover {
      background: #1A1A1A;
      color: #F5F1EB;
    }

    /* ---------- Welcome state ---------- */
    .welcome {
      flex: 1;
      padding: 36px 24px 24px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: stretch;
      gap: 20px;
      background:
        radial-gradient(circle at 80% 20%, ${CONFIG.color}12, transparent 60%);
    }
    .welcome-eyebrow {
      font-size: 11px;
      letter-spacing: 0.12em;
      text-transform: uppercase;
      color: ${CONFIG.color};
      font-weight: 500;
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .welcome-eyebrow::before {
      content: '';
      width: 6px;
      height: 6px;
      background: ${CONFIG.color};
      border-radius: 50%;
    }
    .welcome-title {
      font-family: 'Fraunces', Georgia, serif;
      font-size: 30px;
      line-height: 1.05;
      letter-spacing: -0.025em;
      font-weight: 380;
      font-variation-settings: 'opsz' 144, 'SOFT' 50;
      margin-bottom: 4px;
    }
    .welcome-title em {
      font-style: italic;
      color: ${CONFIG.color};
      font-weight: 320;
      font-variation-settings: 'opsz' 144, 'SOFT' 100;
    }
    .welcome-body {
      color: #8B857B;
      font-size: 14px;
      line-height: 1.55;
    }
    .welcome-bullets {
      list-style: none;
      display: flex;
      flex-direction: column;
      gap: 10px;
      margin-top: 4px;
    }
    .welcome-bullets li {
      font-size: 13px;
      color: #B5AFA5;
      padding-left: 22px;
      position: relative;
      line-height: 1.45;
    }
    .welcome-bullets li::before {
      content: '';
      position: absolute;
      left: 0;
      top: 7px;
      width: 12px;
      height: 1px;
      background: ${CONFIG.color};
    }
    .start-btn {
      margin-top: 12px;
      background: #F5F1EB;
      color: #0A0A0A;
      padding: 14px 20px;
      border-radius: 999px;
      font-weight: 500;
      font-size: 14px;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      transition: background 0.2s, transform 0.15s;
    }
    .start-btn:hover {
      background: ${CONFIG.color};
      transform: translateY(-1px);
    }
    .start-btn .arrow { transition: transform 0.2s; }
    .start-btn:hover .arrow { transform: translateX(3px); }

    .welcome-footer {
      margin-top: auto;
      padding-top: 20px;
      font-size: 11px;
      color: #5A554E;
      text-align: center;
      letter-spacing: 0.02em;
    }
    .welcome-footer a {
      color: #8B857B;
      text-decoration: none;
      font-weight: 500;
    }

    /* ---------- Chat ---------- */
    .chat {
      flex: 1;
      overflow-y: auto;
      overscroll-behavior: contain;
      -webkit-overflow-scrolling: touch;
      padding: 18px 18px 12px;
      display: flex;
      flex-direction: column;
      gap: 12px;
      scroll-behavior: smooth;
      min-height: 0;
    }
    .chat::-webkit-scrollbar { width: 6px; }
    .chat::-webkit-scrollbar-track { background: transparent; }
    .chat::-webkit-scrollbar-thumb { background: #2A2A2A; border-radius: 3px; }
    .chat::-webkit-scrollbar-thumb:hover { background: #3A3A3A; }

    .msg {
      max-width: 88%;
      padding: 10px 14px;
      border-radius: 14px;
      font-size: 14px;
      line-height: 1.5;
      white-space: pre-wrap;
      word-wrap: break-word;
      animation: msg-in 0.3s cubic-bezier(0.2, 0.8, 0.2, 1);
    }
    @keyframes msg-in {
      from { opacity: 0; transform: translateY(6px); }
      to { opacity: 1; transform: translateY(0); }
    }
    .msg.assistant {
      background: #161616;
      border: 1px solid #1F1F1F;
      align-self: flex-start;
      border-bottom-left-radius: 4px;
    }
    .msg.user {
      background: ${CONFIG.color};
      color: #0A0A0A;
      align-self: flex-end;
      border-bottom-right-radius: 4px;
      font-weight: 450;
    }
    .msg .cursor {
      display: inline-block;
      width: 7px;
      height: 14px;
      background: ${CONFIG.color};
      animation: blink 0.9s infinite;
      vertical-align: text-bottom;
      margin-left: 2px;
    }
    @keyframes blink {
      0%, 50% { opacity: 1; }
      51%, 100% { opacity: 0; }
    }

    .file-chip {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      background: #1F1F1F;
      border: 1px solid #2A2A2A;
      padding: 6px 12px 6px 10px;
      border-radius: 999px;
      font-size: 12px;
      color: #B5AFA5;
      max-width: 100%;
    }
    .file-chip .filename {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      max-width: 220px;
    }
    .file-chip .filesize { color: #5A554E; font-size: 11px; }

    /* ---------- Input ---------- */
    .input-area {
      border-top: 1px solid #1F1F1F;
      padding: 12px 12px 14px;
      background: #0A0A0A;
      flex-shrink: 0;
    }
    .input-files {
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
      padding: 0 4px 8px;
    }
    .input-files:empty { display: none; }
    .pending-chip {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      background: #1F1F1F;
      border: 1px solid #2A2A2A;
      padding: 4px 6px 4px 10px;
      border-radius: 999px;
      font-size: 12px;
      color: #B5AFA5;
    }
    .pending-chip .remove {
      width: 18px;
      height: 18px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 50%;
      color: #8B857B;
    }
    .pending-chip .remove:hover { background: #2A2A2A; color: #F5F1EB; }

    .input-row {
      display: flex;
      align-items: flex-end;
      gap: 8px;
      background: #141414;
      border: 1px solid #1F1F1F;
      border-radius: 14px;
      padding: 4px 4px 4px 10px;
      transition: border-color 0.15s;
    }
    .input-row:focus-within { border-color: #2A2A2A; }

    .attach-btn {
      width: 36px;
      height: 36px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #8B857B;
      border-radius: 8px;
      transition: background 0.15s, color 0.15s;
      flex-shrink: 0;
    }
    .attach-btn:hover { background: #1F1F1F; color: #F5F1EB; }
    .attach-btn:disabled { opacity: 0.4; cursor: not-allowed; }

    textarea {
      flex: 1;
      background: transparent;
      color: #F5F1EB;
      font-family: inherit;
      font-size: 14px;
      line-height: 1.4;
      resize: none;
      min-height: 24px;
      max-height: 100px;
      padding: 10px 4px;
      border: none;
      outline: none;
    }
    textarea::placeholder { color: #5A554E; }

    .send-btn {
      width: 36px;
      height: 36px;
      background: ${CONFIG.color};
      color: #0A0A0A;
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: transform 0.15s, opacity 0.15s;
      flex-shrink: 0;
    }
    .send-btn:hover:not(:disabled) { transform: translateY(-1px); }
    .send-btn:disabled { opacity: 0.3; cursor: not-allowed; }

    .submit-bar {
      padding: 0 12px;
      margin-bottom: 8px;
      animation: msg-in 0.3s;
    }
    .submit-btn {
      width: 100%;
      padding: 11px;
      background: transparent;
      color: ${CONFIG.color};
      border: 1px dashed ${CONFIG.color}66;
      border-radius: 10px;
      font-size: 13px;
      font-weight: 500;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      transition: background 0.15s, border-color 0.15s;
    }
    .submit-btn:hover {
      background: ${CONFIG.color}10;
      border-color: ${CONFIG.color};
    }

    .footer-line {
      text-align: center;
      font-size: 10px;
      letter-spacing: 0.08em;
      color: #3A3530;
      text-transform: uppercase;
      padding: 8px 0 0;
    }
    .footer-line a {
      color: #5A554E;
      text-decoration: none;
      font-weight: 500;
    }
    .footer-line a:hover { color: #8B857B; }

    /* ---------- Success state ---------- */
    .success {
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 16px;
      padding: 40px 30px;
      text-align: center;
      background:
        radial-gradient(circle at 50% 30%, ${CONFIG.color}15, transparent 60%);
    }
    .success-check {
      width: 60px;
      height: 60px;
      border-radius: 50%;
      background: ${CONFIG.color}1A;
      border: 1px solid ${CONFIG.color}40;
      display: flex;
      align-items: center;
      justify-content: center;
      color: ${CONFIG.color};
      animation: pop-in 0.5s cubic-bezier(0.4, 1.6, 0.4, 1);
    }
    @keyframes pop-in {
      0% { transform: scale(0); opacity: 0; }
      100% { transform: scale(1); opacity: 1; }
    }
    .success-title {
      font-family: 'Fraunces', Georgia, serif;
      font-size: 24px;
      letter-spacing: -0.02em;
      font-weight: 400;
    }
    .success-title em { font-style: italic; color: ${CONFIG.color}; }
    .success-body { color: #8B857B; font-size: 14px; line-height: 1.5; max-width: 32ch; }
    .success-headline {
      background: #141414;
      border: 1px solid #1F1F1F;
      border-radius: 10px;
      padding: 12px 14px;
      font-size: 13px;
      color: #B5AFA5;
      max-width: 90%;
      margin-top: 8px;
    }
    .success-headline-label {
      font-size: 10px;
      letter-spacing: 0.1em;
      text-transform: uppercase;
      color: ${CONFIG.color};
      margin-bottom: 4px;
    }
    .success-actions {
      margin-top: 12px;
      display: flex;
      flex-direction: column;
      gap: 8px;
      width: 100%;
    }
    .success-actions button {
      padding: 10px;
      font-size: 13px;
      color: #8B857B;
      border-radius: 8px;
      transition: color 0.15s;
    }
    .success-actions button:hover { color: #F5F1EB; }

    /* ---------- Error state ---------- */
    .error-banner {
      margin: 0 18px 8px;
      padding: 10px 12px;
      background: #2A1410;
      border: 1px solid #4A1F18;
      border-radius: 8px;
      font-size: 12px;
      color: #FF9F8C;
      display: flex;
      align-items: center;
      gap: 8px;
    }

    /* ---------- Loading state ---------- */
    .loading {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;
      gap: 14px;
      color: #8B857B;
      font-size: 13px;
    }
    .spinner {
      width: 24px;
      height: 24px;
      border: 2px solid #1F1F1F;
      border-top-color: ${CONFIG.color};
      border-radius: 50%;
      animation: spin 0.9s linear infinite;
    }
    @keyframes spin { to { transform: rotate(360deg); } }
  `;

  // ---------- HTML templates ----------
  const html = (strings, ...values) =>
    strings.reduce((acc, str, i) => acc + str + (values[i] ?? ''), '');

  function launcherHTML() {
    return html`
      <button class="launcher" id="launcher" aria-label="${CONFIG.launcherText}">
        <span class="launcher-dot"></span>
        <span>${CONFIG.launcherText}</span>
      </button>
    `;
  }

  function panelShell() {
    return html`
      <div class="panel" id="panel" role="dialog" aria-label="Forgio enquiry assistant">
        <header class="header">
          <div class="brand">
            <span class="brand-dot"></span>
            <span>forgio</span>
          </div>
          <button class="expand-btn" id="expand" aria-label="Toggle fullscreen">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M2 6V2H6M10 2H14V6M14 10V14H10M6 14H2V10" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>
          <button class="close-btn" id="close" aria-label="Close">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M3 3L13 13M13 3L3 13" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/>
            </svg>
          </button>
        </header>
        <div id="body" style="flex: 1; display: flex; flex-direction: column; min-height: 0;"></div>
      </div>
    `;
  }

  function welcomeHTML() {
    return html`
      <div class="welcome">
        <div class="welcome-eyebrow">AI pre-sales engineer</div>
        <h2 class="welcome-title">Get your project <em>quoted faster</em>.</h2>
        <p class="welcome-body">
          Tell me about your project. I'll ask the right technical questions and pass everything across to the engineering team — so you get a proper quote, not a request for more details.
        </p>
        <ul class="welcome-bullets">
          <li>Takes about 3–5 minutes</li>
          <li>You can attach drawings or specs</li>
          <li>An engineer reviews everything you share</li>
        </ul>
        <button class="start-btn" id="start">
          <span>Start my enquiry</span>
          <svg class="arrow" width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M3 7H11M11 7L7 3M11 7L7 11" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>
        <div class="welcome-footer">
          Powered by <a href="https://forgio.co.uk" target="_blank" rel="noopener">Forgio</a>
        </div>
      </div>
    `;
  }

  function chatHTML() {
    return html`
      <div class="chat" id="chat"></div>
      <div id="submit-bar" style="display:none;" class="submit-bar">
        <button class="submit-btn" id="submit-btn">
          <svg width="12" height="12" viewBox="0 0 14 14" fill="none">
            <path d="M3 7H11M11 7L7 3M11 7L7 11" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          Submit enquiry to engineering team
        </button>
      </div>
      <div class="input-area">
        <div class="input-files" id="pending-files"></div>
        <div class="input-row">
          ${CONFIG.allowUploads ? html`
          <button class="attach-btn" id="attach" aria-label="Attach file">
            <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
              <path d="M14.5 9.5L10 14C8.5 15.5 6 15.5 4.5 14C3 12.5 3 10 4.5 8.5L10 3C11 2 12.5 2 13.5 3C14.5 4 14.5 5.5 13.5 6.5L8 12C7.5 12.5 6.7 12.5 6.2 12C5.7 11.5 5.7 10.7 6.2 10.2L11 5.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>
          <input type="file" id="file-input" multiple accept=".pdf,.png,.jpg,.jpeg,.dwg,.dxf,.step,.stp,.iges,.igs,.doc,.docx,.xls,.xlsx" style="display:none;" />
          ` : ''}
          <textarea id="input" placeholder="Type your message…" rows="1"></textarea>
          <button class="send-btn" id="send" aria-label="Send">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M2 8L14 2L11 14L7.5 9L2 8Z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round" stroke-linecap="round"/>
            </svg>
          </button>
        </div>
        <div class="footer-line">
          Powered by <a href="https://forgio.co.uk" target="_blank" rel="noopener">Forgio</a>
        </div>
      </div>
    `;
  }

  function loadingHTML() {
    return html`
      <div class="loading">
        <div class="spinner"></div>
        <div>Sending your enquiry…</div>
      </div>
    `;
  }

  function successHTML(headline) {
    return html`
      <div class="success">
        <div class="success-check">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
            <path d="M5 12L10 17L19 7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </div>
        <h2 class="success-title">Enquiry <em>received</em>.</h2>
        <p class="success-body">
          An engineer will review the details and be in touch shortly.
        </p>
        ${headline ? html`
          <div class="success-headline">
            <div class="success-headline-label">Your enquiry</div>
            ${headline}
          </div>
        ` : ''}
        <div class="success-actions">
          <button id="success-close">Close</button>
        </div>
      </div>
    `;
  }

  function errorHTML(message) {
    return html`
      <div class="error-banner">
        <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
          <path d="M8 5V8M8 11V11.01M14 8C14 11.3137 11.3137 14 8 14C4.68629 14 2 11.3137 2 8C2 4.68629 4.68629 2 8 2C11.3137 2 14 4.68629 14 8Z" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        <span>${message}</span>
      </div>
    `;
  }

  // ---------- State ----------
  const state = {
    open: false,
    phase: 'welcome', // 'welcome' | 'chat' | 'submitting' | 'success' | 'error'
    messages: [],     // { role: 'user' | 'assistant', content: string, files?: [] }
    pendingFiles: [], // [{ file_id, filename, size }]
    streaming: false,
    finalRfq: null,
  };

  // ---------- Render ----------
  function render() {
    const styleEl = `<style>${styles}</style>`;
    if (!state.open) {
      shadow.innerHTML = styleEl + launcherHTML();
      shadow.getElementById('launcher').addEventListener('click', open);
      return;
    }
    shadow.innerHTML = styleEl + panelShell();
    shadow.getElementById('close').addEventListener('click', close);
    shadow.getElementById('expand').addEventListener('click', () => {
      const panel = shadow.getElementById('panel');
      panel.classList.toggle('fullscreen');
      const btn = shadow.getElementById('expand');
      if (panel.classList.contains('fullscreen')) {
        btn.innerHTML = '<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M6 2L6 6H2M10 6H14V2M14 14H10V10M2 10V14H6" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/></svg>';
      } else {
        btn.innerHTML = '<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M2 6V2H6M10 2H14V6M14 10V14H10M6 14H2V10" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/></svg>';
      }
    });

    // Prevent scroll propagation to host page when scrolling over the widget
    const panelEl = shadow.getElementById('panel');
    panelEl.addEventListener('wheel', (e) => {
      const chatEl = shadow.getElementById('chat');
      if (!chatEl) {
        // No scrollable area — block all wheel events on the panel
        e.preventDefault();
        return;
      }
      const { scrollTop, scrollHeight, clientHeight } = chatEl;
      const isAtTop = scrollTop === 0;
      const isAtBottom = scrollTop + clientHeight >= scrollHeight - 1;
      // If wheel target is outside the chat, prevent default
      if (!chatEl.contains(e.target)) {
        e.preventDefault();
        return;
      }
      // If scrolling up at the top, or down at the bottom, prevent chain
      if ((e.deltaY < 0 && isAtTop) || (e.deltaY > 0 && isAtBottom)) {
        e.preventDefault();
      }
    }, { passive: false });

    const body = shadow.getElementById('body');

    if (state.phase === 'welcome') {
      body.innerHTML = welcomeHTML();
      shadow.getElementById('start').addEventListener('click', startChat);
    } else if (state.phase === 'chat') {
      body.innerHTML = chatHTML();
      bindChatHandlers();
      renderMessages();
      maybeShowSubmit();
    } else if (state.phase === 'submitting') {
      body.innerHTML = loadingHTML();
    } else if (state.phase === 'success') {
      body.innerHTML = successHTML(state.finalRfq?.headline);
      shadow.getElementById('success-close').addEventListener('click', close);
    }
  }

  function open() {
    state.open = true;
    render();
  }

  function close() {
    if (state.phase === "success" || state.phase === "error") {
      state.phase = "welcome";
      state.messages = [];
      state.pendingFiles = [];
      state.streaming = false;
      state.finalRfq = null;
    }
    state.open = false;
    render();
  }

  // ---------- Welcome → Chat ----------
  async function startChat() {
    state.phase = 'chat';
    render();
    try {
      const r = await fetch(`${CONFIG.apiUrl}/api/chat/greeting${CONFIG.demo ? '?demo=1' : ''}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          template: CONFIG.template,
          demo: CONFIG.demo,
        }),
      });
      if (!r.ok) {
        const data = await r.json().catch(() => ({ message: 'Demo unavailable.' }));
        pushError(data.message || "Couldn't load the assistant.");
        return;
      }
      const data = await r.json();
      state.messages.push({ role: 'assistant', content: data.greeting });
      renderMessages();
    } catch (err) {
      pushError("Couldn't load the assistant. Please try again.");
    }
  }

  function pushError(message) {
    const body = shadow.getElementById('body');
    if (body && !body.querySelector('.error-banner')) {
      const wrapper = document.createElement('div');
      wrapper.innerHTML = errorHTML(message);
      body.insertBefore(wrapper.firstElementChild, body.firstChild);
    }
  }

  // ---------- Messages ----------
  function renderMessages() {
    const chatEl = shadow.getElementById('chat');
    if (!chatEl) return;
    chatEl.innerHTML = '';
    for (const m of state.messages) {
      const div = document.createElement('div');
      div.className = 'msg ' + m.role;
      div.textContent = m.content;
      // Attach file chips if this message has files
      if (m.files && m.files.length > 0) {
        for (const f of m.files) {
          const chip = document.createElement('div');
          chip.className = 'file-chip';
          chip.innerHTML = html`
            <svg width="11" height="11" viewBox="0 0 16 16" fill="none">
              <path d="M3 1H10L13 4V14C13 14.5 12.5 15 12 15H3C2.5 15 2 14.5 2 14V2C2 1.5 2.5 1 3 1Z" stroke="currentColor" stroke-width="1.2"/>
            </svg>
            <span class="filename">${escapeHTML(f.filename)}</span>
            <span class="filesize">${formatSize(f.size)}</span>
          `;
          div.appendChild(document.createElement('br'));
          div.appendChild(chip);
        }
      }
      chatEl.appendChild(div);
    }
    chatEl.scrollTop = chatEl.scrollHeight;
  }

  function bindChatHandlers() {
    const sendBtn = shadow.getElementById('send');
    const input = shadow.getElementById('input');
    const attachBtn = shadow.getElementById('attach');
    const fileInput = shadow.getElementById('file-input');
    const submitBtn = shadow.getElementById('submit-btn');

    sendBtn.addEventListener('click', sendMessage);
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
      }
    });
    input.addEventListener('input', () => {
      input.style.height = 'auto';
      input.style.height = Math.min(input.scrollHeight, 100) + 'px';
    });
    if (attachBtn && fileInput) {
      attachBtn.addEventListener('click', () => fileInput.click());
      fileInput.addEventListener('change', handleFiles);
    }
    if (submitBtn) submitBtn.addEventListener('click', finaliseEnquiry);
  }

  async function sendMessage() {
    if (state.streaming) return;
    const input = shadow.getElementById('input');
    const text = input.value.trim();
    if (!text && state.pendingFiles.length === 0) return;

    state.streaming = true;

    const userMsg = { role: 'user', content: text };
    if (state.pendingFiles.length > 0) {
      userMsg.files = [...state.pendingFiles];
      state.pendingFiles = [];
      renderPendingFiles();
    }
    state.messages.push(userMsg);
    input.value = '';
    input.style.height = 'auto';
    renderMessages();

    // Build the request payload — files are mentioned in text so the AI knows
    let payload = [...state.messages];
    if (userMsg.files && userMsg.files.length > 0) {
      const fileList = userMsg.files.map(f => `[Attached: ${f.filename}]`).join(' ');
      payload = payload.map((m, i) =>
        i === payload.length - 1
          ? { ...m, content: `${m.content}${m.content ? '\n' : ''}${fileList}`.trim() }
          : { role: m.role, content: m.content }
      );
    } else {
      payload = payload.map(m => ({ role: m.role, content: m.content }));
    }

    // Add empty assistant placeholder for streaming
    const assistantMsg = { role: 'assistant', content: '' };
    state.messages.push(assistantMsg);
    renderMessages();

    try {
      const r = await fetch(`${CONFIG.apiUrl}/api/chat${CONFIG.demo ? '?demo=1' : ''}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: payload,
          template: CONFIG.template,
          demo: CONFIG.demo,
        }),
      });

      if (!r.ok) {
        const errData = await r.json().catch(() => ({}));
        throw new Error(errData.message || `HTTP ${r.status}`);
      }

      const reader = r.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });

        const lines = buffer.split('\n\n');
        buffer = lines.pop();

        for (const line of lines) {
          if (!line.startsWith('data:')) continue;
          const json = line.slice(5).trim();
          if (!json) continue;
          try {
            const ev = JSON.parse(json);
            if (ev.type === 'text_delta') {
              assistantMsg.content += ev.text;
              const chatEl = shadow.getElementById('chat');
              const lastEl = chatEl?.lastElementChild;
              if (lastEl) {
                lastEl.textContent = assistantMsg.content;
                chatEl.scrollTop = chatEl.scrollHeight;
              }
            }
          } catch (_e) { /* partial chunk */ }
        }
      }
    } catch (err) {
      assistantMsg.content = "Sorry — I lost connection. Please try sending again.";
      renderMessages();
    } finally {
      state.streaming = false;
      maybeShowSubmit();
    }
  }

  // ---------- File upload ----------
  async function handleFiles(e) {
    const files = Array.from(e.target.files || []);
    e.target.value = ''; // reset so same file can be re-selected
    for (const file of files) {
      if (file.size > 10 * 1024 * 1024) {
        pushError(`${file.name} is over 10MB — please share a smaller version.`);
        continue;
      }
      const placeholder = {
        file_id: 'pending-' + Math.random(),
        filename: file.name,
        size: file.size,
        uploading: true,
      };
      state.pendingFiles.push(placeholder);
      renderPendingFiles();

      try {
        const fd = new FormData();
        fd.append('file', file);
        fd.append('session_id', SESSION_ID);
        const r = await fetch(`${CONFIG.apiUrl}/api/files`, { method: 'POST', body: fd });
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        const data = await r.json();
        // Replace placeholder
        const idx = state.pendingFiles.findIndex(f => f.file_id === placeholder.file_id);
        if (idx !== -1) {
          state.pendingFiles[idx] = {
            file_id: data.file_id,
            filename: data.filename,
            size: data.size,
          };
        }
      } catch (err) {
        state.pendingFiles = state.pendingFiles.filter(f => f.file_id !== placeholder.file_id);
        pushError(`Couldn't upload ${file.name}.`);
      }
      renderPendingFiles();
    }
  }

  function renderPendingFiles() {
    const el = shadow.getElementById('pending-files');
    if (!el) return;
    el.innerHTML = '';
    for (const f of state.pendingFiles) {
      const chip = document.createElement('div');
      chip.className = 'pending-chip';
      chip.innerHTML = html`
        <span>${escapeHTML(f.filename)}</span>
        <span class="filesize">${formatSize(f.size)}</span>
        <button class="remove" aria-label="Remove" data-id="${f.file_id}">
          <svg width="10" height="10" viewBox="0 0 16 16" fill="none">
            <path d="M3 3L13 13M13 3L3 13" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/>
          </svg>
        </button>
      `;
      chip.querySelector('.remove').addEventListener('click', () => {
        state.pendingFiles = state.pendingFiles.filter(x => x.file_id !== f.file_id);
        renderPendingFiles();
      });
      el.appendChild(chip);
    }
  }

  // ---------- Submit ----------
  function maybeShowSubmit() {
    const bar = shadow.getElementById('submit-bar');
    if (!bar) return;
    // Show submit button after 4+ exchanges (2 from each side)
    const userTurns = state.messages.filter(m => m.role === 'user').length;
    if (userTurns >= 3) bar.style.display = 'block';
  }

  async function finaliseEnquiry() {
    state.phase = 'submitting';
    render();
    try {
      const payload = state.messages.map(m => ({ role: m.role, content: m.content }));
      const r = await fetch(`${CONFIG.apiUrl}/api/rfq/finalize${CONFIG.demo ? '?demo=1' : ''}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: payload,
          session_id: SESSION_ID,
          tenant: CONFIG.tenant,
          template: CONFIG.template,
          demo: CONFIG.demo,
        }),
      });
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      const data = await r.json();
      state.finalRfq = data.rfq;
      state.phase = 'success';
      render();
    } catch (err) {
      state.phase = 'chat';
      render();
      pushError("Couldn't submit your enquiry. Please try again.");
    }
  }

  // ---------- Helpers ----------
  function escapeHTML(s) {
    return String(s).replace(/[&<>"']/g, c =>
      ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c])
    );
  }

  function formatSize(bytes) {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  }

  // ---------- Boot ----------
  render();
})();
