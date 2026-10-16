# QA de navegador — 12/10/2026

Execução por Thiago Ventura/Codex no Chrome, em WordPress 6.8.3, WooCommerce 10.2.2 e PHP 8.3.35. Dados sintéticos. Não equivale à reprodução por outro integrante, ao ensaio do apresentador ou à homologação da hospedagem.

## Defeito encontrado e reteste

`wp_localize_script` converte escalares em strings. O PHP emitia `consented: "1"` e `productId: "11"`; o JS exigia booleano e a rota exigia ID inteiro. O cookie era válido, porém a página recarregada mostrava coleta desativada; eventos de produto poderiam retornar 400. Corrigido com `wp_add_inline_script` e JSON que preserva os tipos. Duas regressões executadas no WordPress real integram a matriz de 44 verificações.

Primeira rodada: detectado o defeito; aplicada a correção na cópia instalada e conferidas as ações administrativas. Segunda rodada: banco novo e instalação nova do ZIP corrigido, SHA256 `f4f4d330180ba23d79849c01b0ffadfba4441104374c37ea93fa7fd0c38d1c29`. A matriz CLI também instalou esse mesmo ZIP.

| Ação real no Chrome | Resultado observado |
| --- | --- |
| Visita sem consentimento / recusa inicial | Estado desativado; primeira rodada com zero eventos |
| Permitir eventos | Estado permitido e primeiro `view` recebido pela API |
| Recarregar | Estado permitido preservado e outro `view` recebido |
| Abrir produto 11 | `view` com `productId` inteiro recebido |
| Add to cart | Sucesso do carrinho WooCommerce; um `add_to_cart` recebido, além do `view` da recarga |
| Revogar e recarregar | Estado desativado; contagem permanece em cinco eventos |
| Admin: atualizar diagnóstico | Estado conectado, catálogo com um produto e último evento consultável |
| Admin: desligar coleta | Preferência persistida; nenhum painel nem script tracking na vitrine |
| Admin: desconectar | Estado desconectado; integração sintética revogada na API |
| Admin: conectar em HTTP localhost | Exige HTTPS antes de parear; código não reapresentado |

[Backend final](./backend.json) preserva somente tipos, IDs sintéticos e instantes. Os arquivos `.txt` desta pasta são snapshots da interface real, incluindo [persistência](./consent-persistido.txt), [produto/carrinho](./produto-carrinho.txt), [revogação](./consent-revogado.txt), [admin](./admin-conectado.txt), [desconexão](./admin-desconectado.txt) e [coleta desligada](./tracking-desligado.txt). Os snapshots administrativos são da primeira rodada com o código corrigido; o backend final é da segunda rodada, antes de desconectar a integração.

## Reprodução

Após o setup de [AMBIENTE-PLUGIN](../../entregas/AMBIENTE-PLUGIN.md), com PHP/ini e BOOPAY_QA_ROOT configurados:

```powershell
npm run package:plugin
npm run qa:browser
```

O runner cria novo banco/site/API, instala o ZIP e informa `http://localhost:8089`. Abra no Chrome e use os botões. Em outro terminal, processe a fila e consulte os eventos:

```powershell
& $env:PHP_BINARY -c $env:BOOPAY_QA_PHP_INI scripts/inspect-browser-qa.php --product --drain
npx tsx scripts/inspect-browser-qa.ts
```

Sem ini específico, omita `-c $env:BOOPAY_QA_PHP_INI`. O produto sintético criado pelo comando permite conferir a página e o carrinho. Para entrar no admin, usuário `qa_admin`; senha gerada em `login.txt` na pasta indicada por `.test-artifacts/browser-current.json`. Ela fica fora do docroot, ignorada pelo Git; nunca publicar o arquivo. Ctrl+C encerra o runner; com stdin aberto, `q` + Enter também encerra.

Perfil de UI: HTTP apenas em loopback, com cookie Secure aceito pelo Chrome em localhost. Pareamento/seed são preparados por CLI com URL lógica `https://store.example`; não constituem navegação HTTPS pública. Eventos/diagnóstico chegam à API por HTTPS real com CA temporária fornecida ao WordPress, sem desativar TLS nem instalar certificados no sistema. Nenhum mock de rota WordPress é usado. O runner principal comprova pareamento HTTPS e instalação/lifecycle; a CI contém perfis SQLite e MySQL para a matriz completa.
