# Multiloja: contexto autorizado e isolamento — RB-081

Issue [#19](https://github.com/Pedro-Lucas001/boopay/issues/19). Checkpoint S1: **19/10/2026**. Implementação sobre SQLite atual; não implementa PostgreSQL da #50, Firestore/BigQuery, CDP ou checkout futuro.

## Modelo e credenciais

- `Merchant.tenantId`: vínculo da loja. Primeiro código emitido pelo administrador fixa o tenant; códigos posteriores não podem mover a loja.
- `Integration`: credencial independente do plugin vinculada a tenant/merchant/URL; autenticação também confere o dono atual da loja.
- `Operator`: credencial de operador, hash persistido e revogação. Token retornado uma única vez na criação por administrador.
- `OperatorGrant`: vínculo operador/loja com `reader` ou `writer`; chave composta e FK. Operador pode ter acesso explícito a mais de uma loja.
- `Product`: SKU legado agora é único por merchant, não global. `CatalogItem`, `CatalogReceipt` e `StoreEvent` preservam suas identidades por integração + origem/evento.

O [TenantAccess](../../src/security/tenant-context.ts) consulta vínculo em cada requisição; não usa tenant enviado pelo cliente ou cache global de contexto. Credenciais de operador, integração e administração são papéis distintos. Administrador é uma credencial privilegiada de servidor, nunca a usada na tela.

## APIs e permissões

| Operação | Autorização | Comportamento |
| --- | --- | --- |
| `POST /v1/admin/operators` | Administrador | Corpo `{display_name,grants:[{merchant_id,role}]}`; retorna ID/token com `no-store`. Lojas precisam estar vinculadas/ativas. |
| `POST /v1/admin/operators/:operatorId/revoke` | Administrador | Revoga imediatamente novas requisições do operador. |
| `GET /v1/operator/stores` | Operador | Lista somente lojas explicitamente autorizadas e ativas. |
| `GET /v1/operator/stores/:merchantId/catalog?page=1&limit=20` | Reader/writer da loja | Catálogo paginado por loja/tenant; campos necessários, sem credenciais. |
| `GET /v1/operator/stores/:merchantId/health` | Reader/writer da loja | Contagens e estado das integrações daquela loja; sem tokens/segredos/pseudônimos. |
| `POST /v1/operator/stores/:merchantId/connection-codes` | Writer da loja | Recebe somente `store_url`; tenant/merchant vêm do contexto autorizado. |
| `POST /v1/operator/stores/:merchantId/disconnect` | Writer da loja | Recebe `integration_id`; só revoga a integração pertencente à loja do contexto. |

401: credencial inválida/revogada. 403: loja/papel não autorizado ou vínculo de tenant incompatível. 400: payload/filtros inválidos. 404: integração não disponível no escopo. Nenhum destes erros devolve dados da outra loja.

As rotas de ingestão existentes continuam exigindo Bearer/HMAC e vínculo tenant/integração/merchant. Nonce de transporte e evento de negócio são distintos. Repetição de evento conserva identidade/corpo; retries não escolhem uma loja nova.

## Console e reprodução

`GET /operator` serve uma superfície mínima de consulta. O operador informa sua credencial, seleciona uma loja autorizada e vê catálogo/contagens reais da API. Token fica somente em memória; sair limpa o estado. Respostas são `no-store`, CSP restringe scripts/conexão ao próprio domínio e dados de catálogo são renderizados com `textContent`.

```powershell
npm run db:generate
node --import tsx --test tests/tenant-isolation.test.ts
npm run check
node --import tsx scripts/serve-multistore-qa.ts
```

O último comando cria banco **novo** dentro de `.test-artifacts`, aplica migrations, prepara duas lojas e inicia `http://127.0.0.1:3340/operator`. O caminho do `access.json` é informado, sem imprimir token. Leia o token localmente para entrar; não versione nem compartilhe esse arquivo. Operador de duas lojas permite alternar Recife/Olinda; operador restrito só vê Recife. Ambos são somente leitores nesta fixture. Produtos/identidades são sintéticos; preço diferente para o mesmo ID/SKU comprova a separação de contexto, não uma loja comercial conectada.

## Migração e legado

Migration `20261017010000_multistore_operator`: adiciona vínculo/associações e corrige índice de SKU. Backfill só associa automaticamente loja com **um tenant inequívoco** nas integrações e sem código com tenant conflitante. Legado ambíguo fica sem vínculo e falha fechado. Um administrador deve auditar referências antes de qualquer correção manual; nunca escolher o tenant pelo primeiro registro ou reparear para mascarar conflito.

Aplicar primeiro em banco descartável/cópia autorizada, conferir vínculos e constraints e só depois planejar o ambiente compartilhado. Recuperação exige backup consistente e revisão dos vínculos; reverter código sozinho não desfaz migration. SQL é específico SQLite e deve ser traduzido/validado pela #50 antes da adoção PostgreSQL. Não executar reset em dados compartilhados.

## Evidências e continuidade

[Testes](../../tests/tenant-isolation.test.ts) cobrem duas lojas, produtos/eventos com IDs iguais, permissões, acesso cruzado de leitura/escrita, falsificação de contexto, revogação, persistência/reinício, segredo omitido e migration sobre legado unívoco/conflitante. [Capturas](../evidencias/RB-081/README.md) mostram seleção e diferenças dos dados.

Fronteiras existentes: persistência/rotas/ingestão/eventos/saúde e fila do plugin vinculadas à integração; respostas/contexto não são compartilhados em cache. Futuras filas servidor, cache de negócio, Firestore/BigQuery, perfil/pedidos e Checkout Core devem consumir o mesmo contexto e ter testes próprios antes do aceite integrado. Esta base não comprova isolamento em componentes ainda não implementados. PR usa `Refs #19` até validação de todas as dependências/fronteiras da issue na versão integrada.
