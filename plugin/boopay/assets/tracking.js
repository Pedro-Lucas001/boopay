/* Sessão somente após consentimento; sem localStorage, URL, email ou dados de compra. */
(() => {
  'use strict';
  const config = window.boopayTracking;
  if (!config) return;
  let granted = config.consented === true;
  let exited = false;
  const request = async (path, body) => {
    const response = await fetch(config.base + path, { method: 'POST', credentials: 'same-origin',
      headers: { 'Content-Type': 'application/json', 'X-WP-Nonce': config.nonce }, body: JSON.stringify(body), keepalive: true });
    if (!response.ok) throw new Error('boopay_unavailable');
    return response;
  };
  const event = kind => {
    if (!granted) return;
    const payload = { kind };
    if (config.productId) payload.product_id = config.productId;
    request('event', payload).catch(() => {});
  };
  const panel = document.createElement('section');
  panel.setAttribute('aria-label', 'Preferências de eventos da loja');
  panel.style.cssText = 'padding:16px;border:1px solid #ccc;background:white;color:#222;position:relative;z-index:10';
  const text = document.createElement('p');
  text.textContent = 'Você permite enviar eventos de navegação para melhorar esta loja? A escolha é opcional e pode ser revogada aqui.';
  const allow = document.createElement('button'); allow.type = 'button'; allow.textContent = 'Permitir eventos';
  const deny = document.createElement('button'); deny.type = 'button'; deny.textContent = 'Recusar / revogar';
  const status = document.createElement('p'); status.setAttribute('role', 'status');
  const render = () => { status.textContent = granted ? 'Eventos permitidos.' : 'Eventos desativados.'; allow.disabled = granted; };
  const consent = async value => {
    allow.disabled = true; deny.disabled = true;
    try { await request('consent', { granted: value }); granted = value; if (value) event('view'); render(); }
    catch { granted = false; status.textContent = 'Não foi possível salvar. Os eventos estão pausados nesta página.'; allow.disabled = false; }
    finally { deny.disabled = false; }
  };
  allow.addEventListener('click', () => consent(true)); deny.addEventListener('click', () => consent(false));
  panel.append(text, allow, deny, status); document.body.append(panel); render();
  if (granted) event('view');
  document.addEventListener('mouseout', e => { if (e.clientY <= 0 && !e.relatedTarget && !exited && granted) { exited = true; event('exit_intent'); } });
})();
