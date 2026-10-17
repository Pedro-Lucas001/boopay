# Camada de IA e ferramentas — RB-042

Issue [#10](https://github.com/Pedro-Lucas001/boopay/issues/10). Checkpoint: 19/10/2026. Código desta entrega é infraestrutura local de contrato; integração com provedores reais é RB-043/#30, consultas de negócio são RB-028/#39 e cotação é responsabilidade do Checkout Core.

## Interface do provedor

[AiService](../../src/ai/provider.ts) recebe adaptadores `AiProvider` por injeção e configuração explícita `provider`, `model`, `timeoutMs`. Há nomes `gpt`/`gemini`, mas nenhum SDK/chave/adaptador externo é instalado implicitamente. Provedor selecionado sem implementação registrada retorna `provider_unavailable`, sem resposta inventada ou troca silenciosa de modelo.

Entrada: `{messages:[{role:"user"|"assistant",content:string}]}`, com limites de quantidade/tamanho e rejeição de campos extras. O chamador não escolhe provedor, modelo, tenant ou mensagem de sistema por esse DTO. Configuração vem do servidor, via objeto ou `configFromEnvironment` (`BOOPAY_AI_PROVIDER`, `BOOPAY_AI_MODEL`, `BOOPAY_AI_TIMEOUT_MS`). O servidor atual não ativa a camada automaticamente: o integrador registra o adaptador real e chama o serviço.

Saída normalizada: `provider`, `model`, `latency_ms` medidos pelo serviço e uma resposta validada:

```json
{"kind":"tool_call","name":"catalog_search","arguments":{"query":"camiseta","limit":5}}
```

Ou `{kind:"answer",text:"..."}`. Texto livre sem estrutura, propriedades extras e nomes de ferramenta desconhecidos são rejeitados. `answer` é texto de conversa: não confirma preço, pagamento ou pedido. Uma `tool_call` é uma proposta, não executa ferramenta por si só.

## Ferramentas permitidas

[CommerceTools](../../src/ai/tools.ts) contém somente duas operações. Schemas Zod executáveis no mesmo arquivo são a referência de campos/tipos/limites.

| Ferramenta | Entrada | Saída e fronteira |
| --- | --- | --- |
| `catalog_search` | query de até 200 caracteres e limit de 1–20, padrão 5 | Produtos reais autorizados, ID/variante, título, preço em unidade mínima/moeda, disponibilidade e revisão; no máximo o limite pedido. |
| `checkout_quote` | 1–20 itens com ID/variante/quantidade e destino reduzido opcional | Referência, versão, expiração, total e `requires_confirmation:true`; fonte autoritativa é a loja/core. Não cobra nem conclui pedido. |

`pay`, `complete`, `create_order`, reembolso e qualquer outro nome não pertencem à allowlist. Tenant, token, cartão e campos pessoais livres não são argumentos aceitos.

O integrador fornece `CommerceToolServices.authorize(accessToken,signal)`, que deve autenticar no servidor e retornar `tenantId`, `merchantId`, `integrationId`; o contexto validado é congelado antes da consulta. `search`/`quote` recebem esse contexto e devem aplicar o escopo em suas próprias queries/APIs. Não substituir o autorizador por contexto vindo do LLM ou do browser. Falha de autorização não chama consulta/cotação.

## Timeout, cancelamento e erros

[bounded](../../src/ai/bounded.ts) limita a espera mesmo se o adaptador ignorar AbortSignal. Propaga cancelamento, remove listener/timer e descarta resultados/rejeições tardios. O serviço verifica cancelamento após autorização, impedindo consulta tardia quando a autorização demorou demais.

| Código | Significado |
| --- | --- |
| `invalid_request` | Configuração/mensagens inválidas |
| `invalid_response` | Resposta do modelo não satisfaz contrato |
| `provider_unavailable` | Adaptador selecionado não foi registrado |
| `provider_timeout` | Limite de espera excedido, inclusive execução de ferramenta |
| `request_aborted` | Chamador cancelou a operação |
| `provider_failed` | Falha do adaptador, sem corpo/segredo do provedor |
| `tool_not_allowed` | Nome fora da allowlist |
| `tool_input_invalid` / `tool_output_invalid` | Contrato inválido ou excesso de resultados |
| `invalid_context` | Contexto autorizado incompleto/inválido |
| `tool_failed` | Falha sanitizada de autorização/consulta |

Callbacks de ferramentas continuam obrigados a honrar cancelamento e a não iniciar efeitos comerciais. Timeout limita a espera, não desfaz um efeito externo: por isso só busca/cotação são permitidas aqui e a conclusão fica no core com confirmação/idempotência.

## Reprodução e integração

```powershell
npm run build
node --import tsx --test tests/ai-tools.test.ts
npm run check
```

O [teste](../../tests/ai-tools.test.ts) usa doubles identificados, sem chaves ou chamadas externas. Demonstra troca de provedor, limites, validação, cancelamento, resultado tardio, autorização e rejeição de cobrança. Não comprova chamadas GPT/Gemini reais, qualidade de recomendação, API de catálogo integrada, pagamento ou publicação em superfícies oficiais.

Passo seguinte de RB-043/RB-028: implementar adaptadores/serviços reais contra estas interfaces, adicionar testes autorizados e registrar modelo/versão/ambiente. Não duplicar o core nem executar instruções comerciais extraídas diretamente do texto do modelo.
