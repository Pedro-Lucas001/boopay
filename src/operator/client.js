(() => {
  const byId = id => document.getElementById(id);
  const login = byId('login'), tokenInput = byId('token'), workspace = byId('workspace');
  const store = byId('store'), status = byId('status'), products = byId('products'), summary = byId('summary');
  let token = '', version = 0, pending;
  const message = (text, error = false) => { status.textContent = text; status.dataset.error = String(error); };
  const clear = () => { products.replaceChildren(); summary.textContent = ''; byId('empty').hidden = true; };
  const logout = () => {
    version++; pending?.abort(); token = ''; tokenInput.value = ''; clear(); store.replaceChildren();
    workspace.hidden = true; login.hidden = false; byId('connect').disabled = false; tokenInput.focus();
  };
  async function request(path, signal) {
    const response = await fetch(path, { headers: { authorization: 'Bearer ' + token }, signal,
      cache: 'no-store', credentials: 'omit', redirect: 'error' });
    if (!response.ok) throw Object.assign(new Error('request_failed'), { status: response.status });
    return response.json();
  }
  async function load() {
    const current = ++version, id = store.value;
    pending?.abort(); pending = new AbortController(); clear();
    byId('refresh').disabled = true; message('Carregando a loja selecionada…');
    try {
      const [catalog, health] = await Promise.all([
        request('/v1/operator/stores/' + encodeURIComponent(id) + '/catalog', pending.signal),
        request('/v1/operator/stores/' + encodeURIComponent(id) + '/health', pending.signal)
      ]);
      if (current !== version) return;
      if (String(catalog.merchant_id) !== id || String(health.merchant_id) !== id) throw new Error('context_mismatch');
      summary.textContent = catalog.total + ' produto(s) sincronizado(s) · ' + health.event_count + ' evento(s) recebido(s)';
      for (const product of catalog.items) {
        const row = document.createElement('tr');
        for (const text of [product.name, String(product.source_id), product.price, product.in_stock ? 'Disponível' : 'Indisponível']) {
          const cell = document.createElement('td'); cell.textContent = text; row.append(cell);
        }
        products.append(row);
      }
      byId('empty').hidden = catalog.items.length !== 0;
      message('Dados atualizados: ' + store.selectedOptions[0].textContent + '.');
    } catch (error) {
      if (current !== version || error.name === 'AbortError') return;
      clear();
      if (error.status === 401) { logout(); message('Acesso expirado ou revogado. Informe uma nova credencial.', true); }
      else message('Não foi possível consultar esta loja. Confira seu acesso e tente atualizar.', true);
    } finally { if (current === version) byId('refresh').disabled = false; }
  }
  login.addEventListener('submit', async event => {
    event.preventDefault(); byId('connect').disabled = true; token = tokenInput.value.trim(); tokenInput.value = '';
    const current = ++version;
    pending?.abort(); pending = new AbortController(); message('Conferindo acesso…');
    try {
      const result = await request('/v1/operator/stores', pending.signal);
      if (current !== version) return;
      if (!result.stores.length) { logout(); message('Nenhuma loja autorizada. Solicite acesso ao administrador.'); return; }
      store.replaceChildren();
      for (const item of result.stores) { const option = document.createElement('option');
        option.value = String(item.merchant_id); option.textContent = item.name; store.append(option); }
      login.hidden = true; workspace.hidden = false; store.focus(); await load();
    } catch (error) {
      if (current !== version || error.name === 'AbortError') return;
      logout(); message('Credencial inválida ou serviço indisponível. Confira o acesso e tente novamente.', true);
    } finally { byId('connect').disabled = false; }
  });
  store.addEventListener('change', load); byId('refresh').addEventListener('click', load);
  byId('logout').addEventListener('click', () => { logout(); message('Sessão encerrada.'); });
})();
