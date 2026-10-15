# Contrato plugin–API v1

Autoria inicial das rotas de catálogo: Pedro Lucas. Complementação de contrato, isolamento, segurança e testes: Thiago Ventura. Revisão humana pendente.

## Transporte e identidade

HTTPS obrigatório, origem da API autorizada pelo operador no servidor WordPress. Sem redirecionamentos; timeout 10 s; corpo máximo 1 MiB. Nunca enviar credenciais em querystring. O código temporário vale 5 minutos, uma utilização e uma URL de loja. A API devolve credenciais somente no pareamento, com `Cache-Control: no-store`.

| Método e caminho | Corpo | Autorização |
| --- | --- | --- |
| POST /v1/admin/connection-codes | tenant_id, merchant_id inteiro positivo, store_url HTTPS | Bearer administrativo, servidor apenas |
| POST /v1/integrations/connect | code, store_url | Código de uso único |
| POST /v1/integrations/disconnect | {} | Bearer da integração |
| POST /v1/admin/catalog/sync | version:1, merchant_id, event_id UUID, items | Bearer + HMAC |
| POST /v1/events | version:1, event_id UUID, kind, session_hash, product_id opcional, occurred_at ISO UTC, consent:true | Bearer + HMAC |
| POST /v1/integrations/health | {} | Bearer + HMAC |
| GET /health | — | Público; apenas liveness |

HMAC SHA256 hexadecimal minúsculo sobre seis linhas, sem LF final: `v1`, método maiúsculo, caminho, timestamp Unix em segundos, nonce, SHA256 hexadecimal dos bytes exatos do corpo. Cabeçalhos: `Authorization: Bearer …`, `X-Boopay-Tenant`, `X-Boopay-Integration`, `X-Boopay-Timestamp`, `X-Boopay-Nonce`, `X-Boopay-Signature`. Desvio máximo ±300 s; nonce novo de 16–128 caracteres por tentativa, retido por 601 s. Repetição de transporte: 409 `replayed_request`; retry usa nonce novo e conserva event_id/corpo.

## Catálogo

Esquema executável: [catalog-contract.ts](../../src/http/catalog-contract.ts). Até 50 produtos por lote; plugin envia 20. Identidade: integração + source_id (ID do produto pai WooCommerce). SKU pode ser vazio ou igual ao de outra loja. Revisão inteira monotônica por produto, gerada no WordPress; vence somente a revisão maior. Exclusão mantém tombstone. Variações formam snapshot completo do pai: a remoção da última variação resulta em `variations:[]`.

Upsert exige source_id, revision, sku, name, type (`simple`/`variable`), price string decimal não negativa, stock inteiro não negativo ou null para estoque não gerenciado, in_stock, url HTTPS, images (até 20 URLs HTTPS), variations (até 100). Cada variação: source_id, sku, price, stock, in_stock, attributes objeto string→string. Tipos externos, preços vazios e produtos acima dos limites são falhas explícitas; não truncar variações silenciosamente. Delete exige apenas action, source_id e revision.

`event_id` identifica o lote: mesmo ID/corpo retorna duplicate:true; mesmo ID/corpo diferente retorna 409 `event_id_conflict`. Recibo e produtos são gravados em uma transação; erro não confirma escrita parcial. Resposta: status success, duplicate, applied, ignored. Lote vazio é sucesso. Campos desconhecidos são rejeitados.

## Eventos e diagnóstico

Tipos: view, add_to_cart, exit_intent. Tracking desligado por padrão. O WordPress obtém consentimento explícito antes de criar sessão; pseudônimo SHA256 com salt da loja. Não aceitar email, endereço, cartão, URL da página ou conteúdo livre. Deduplicação por integração + event_id, conflito se o corpo mudar. Saúde autenticada retorna catalog_count e last_event (ID, tipo e instante recebido), sem token ou pseudônimo.

Erros JSON `{error:codigo}`: 400 invalid_payload/invalid_request, 401 invalid_connection_code/invalid_credentials/invalid_signature/expired_signature, 403 integration_mismatch/merchant_mismatch, 409 replayed_request/event_id_conflict, 413 invalid_request, 500 internal_error. Não expor stack, corpo remoto ou segredo.

## Exemplos e comprovação

[fixtures sintéticas](../../tests/fixtures/catalog-v1.json), [testes de contrato](../../tests/contracts.test.ts), [ingestão](../../tests/ingestion.test.ts), [assinatura](../../tests/signed-request.test.ts). Os testes validam simples, variável, vazio, exclusão, repetição, ordem, remoção de variações, isolamento e payload inválido.

O formato parcial anteriormente existente na main não é um cliente compatível com este contrato completo: exige atualizar backend e plugin juntos pela sequência de PRs. A tabela Product legada é preservada, mas não é fonte de verdade dos novos envios.
