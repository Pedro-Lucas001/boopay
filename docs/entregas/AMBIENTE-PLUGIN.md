# Ambiente reproduzível e pacote — RB-003/004/021

Autoria: Thiago Ventura. Implementação dos cards feita na branch de entrega, preservando responsáveis originais para revisão. Revisão humana/reprodução por outra pessoa pendentes.

## Backend e loja de desenvolvimento

Requisitos: Node 22, PHP 8.3 com curl/openssl/mbstring/pdo_sqlite/sqlite3/zip/fileinfo, PowerShell 7 e acesso aos downloads oficiais WordPress. A matriz executada usa WordPress 6.8.3, WooCommerce 10.2.2, SQLite Database Integration 3.1.0. São versões fixas de teste; não afirmar que são as versões mais recentes ou homologação de produção.

```powershell
npm ci --ignore-scripts --no-audit --no-fund
npm run db:generate
# PHP deve estar no PATH; ou use o caminho absoluto do seu PHP:
$env:PHP_BINARY = 'C:\caminho\php.exe'
# PHP já configurado com extensões: não precisa BOOPAY_QA_PHP_INI.
# Caso use um ini específico, informe seu caminho absoluto:
# $env:BOOPAY_QA_PHP_INI = 'C:\caminho\php.ini'
./scripts/setup-wordpress-qa.ps1
$env:BOOPAY_QA_ROOT = (Resolve-Path '.test-artifacts/wordpress-qa').Path
npm run package:plugin
npm run qa:wordpress
```

O setup baixa ZIPs oficiais com SHA256 fixos, gera apenas salts/credenciais sintéticos locais e uma CA temporária. O runner cria novo banco WordPress e novo banco API por execução; não usa nem apaga banco compartilhado. API escuta somente 127.0.0.1:3334 e proxy TLS 127.0.0.1:8443; portas precisam estar livres. A origem api.boopay.localtest.me resolve loopback. A CA é fornecida somente às requisições HTTP do teste; verificação TLS permanece ativa e nenhum certificado é instalado no sistema. Não levar filtros/CA/scripts QA para hospedagem.

A loja sintética usa URL lógica https://store.example e é exercitada por PHP CLI/runner, com transporte HTTPS real até a API. Este comando é teste automatizado; não abre uma loja pública nem substitui o ensaio visual do time. Copia ZIP para diretório de plugins, usa activate_plugin, WC CRUD, runner Action Scheduler e consulta dados reais da API. No fim desconecta/desinstala e testa guarda sem WooCommerce em outro processo. Diagnóstico inclui timeout real e falhas HTTP injetadas explicitamente.

## Backend para uso pelo time

Escolher um banco SQLite novo via DATABASE_URL, `npm run db:migrate`, `npx tsx scripts/seed-demo.ts`; o seed informa merchant_id sintético. Gerar BOOPAY_CREDENTIAL_KEY (32 bytes hex) e BOOPAY_ADMIN_TOKEN aleatórios, guardar fora do Git. `npm run dev` escuta loopback:3333; operador coloca proxy HTTPS com certificado válido na frente. Emitir código via POST /v1/admin/connection-codes com token administrativo no servidor e URL HTTPS exata da loja. Nunca pôr token administrativo no plugin ou browser. Contrato: [plugin-v1](../contratos/plugin-v1.md).

## Instalação do ZIP pelo revisor

1. Baixar artefato `boopay-plugin-0.1.0` no workflow do PR e conferir SHA256 contra `boopay-0.1.0.manifest.json`.
2. Em loja descartável com HTTPS válido e WooCommerce ativo, instalar ZIP em Plugins → Adicionar → Enviar plugin. Não instalar scripts/tests/node_modules.
3. Operador adiciona ao wp-config.php: `define('BOOPAY_ALLOWED_API_ORIGINS', ['https://api.sua-organizacao.com']);` com origem real autorizada, sem caminho/query.
4. Abrir WooCommerce → BooPay, preencher origem e código fornecido pelo operador. Conectar, sincronizar/retomar, consultar diagnóstico.
5. Criar simples e variável com preços e URLs HTTPS; alterar preço/estoque, remover variação/produto; conferir dados recebidos/contagem. Ativar tracking somente para ensaiar consentimento com dados sintéticos.
6. Conferir ações agendadas/logs, falha controlada/retry e desconexão. Registrar versões, commit/ZIP, passos e resultado no [modelo](./MODELO.md); pedir revisão por PR.

## Pacote e limitações

`npm run package:plugin` gera ZIP determinístico com uma pasta boopay e somente oito arquivos de distribuição. Manifesto lista arquivos, tamanho, versão e SHA256; sem código backend, banco, credencial, testes ou node_modules. Workflow de PR publica ZIP/manifesto como artefato por 14 dias. Para arquivar a entrega, baixar ambos antes da expiração; release pública só após revisão.

MySQL/MariaDB da hospedagem, navegação visual do consentimento e reprodução por outro integrante continuam pendentes. HPOS é habilitado na QA e plugin não acessa pedidos; não comprova checkout/pagamento. Política de retenção de dados/recibos do backend precisa ser acordada antes de operação real. [Resultados executados](../evidencias/WORDPRESS/results.json).

Fontes oficiais: [WordPress 6.8.3](https://wordpress.org/download/releases/), [SQLite Integration](https://wordpress.org/plugins/sqlite-database-integration/), [WooCommerce](https://wordpress.org/plugins/woocommerce/).
