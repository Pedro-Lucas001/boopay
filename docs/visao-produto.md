# Visão e objetivo do Boopay

Versão de planejamento: 14/10/2026. Escopo confirmado por Thiago; revisão técnica e validação do time seguem nas issues/RFCs.

## Problema e usuários
Lojistas precisam disponibilizar catálogo e operações comerciais aos agentes sem perder controle de preço, estoque, identidade, pedidos e resultados. Compradores precisam encontrar produtos e revisar uma compra na conversa, com informação confiável e confirmação explícita. Operadores autorizados precisam administrar lojas e compreender a jornada de seus clientes.

## Proposta de valor e Product Goal
Conectar lojas e agentes para transformar uma conversa em uma compra rastreável. Até **03/11/2026**, ter uma versão integrada e reproduzível em ambiente autorizado de teste, em que um comprador conversa com um agente usando a camada GPT/Gemini, recebe recomendações do catálogo, revisa cotação autoritativa, confirma a operação, conclui pagamento sandbox e tem o pedido reconciliado; o lojista consulta perfil e resultados isolados por loja. **04/11** é o prazo de apresentação/submissão, não o início da validação.

## Escopo confirmado
Plugin WooCommerce; conectores Shopify/VTEX; fundação de dados/APIs/frontend; IA e recuperação de catálogo; Checkout Core e pagamentos de teste; contratos ACP/UCP; GEO/feeds; perfil 360; CDP/identidade avançada; atribuição multitoque; dashboards; observabilidade; testes, documentação e entrega. A operação multiloja exige pelo menos duas lojas de teste com isolamento validado. São **83 tarefas**, agrupadas no [backlog rastreável](backlog.md), com [metas semanais](sprints/README.md).

## Exclusões e limites
Planos/cobrança SaaS (#20) e homologação/publicação oficial em superfícies ChatGPT/Gemini (#21) continuam futuras. Uma integração local ou sandbox não comprova compra liberada a qualquer usuário nas superfícies oficiais. WhatsApp fica fora do escopo. Pagamento de teste não comprova transação em produção.

## Fatos, hipóteses e dúvidas
- **Confirmado:** prazo 04/11; multiloja, CDP e multitoque incluídos em 14/10; plugin informado como entregue por Thiago. O aceite e a integração dos PRs continuam sujeitos a evidência.
- **A verificar:** capacidade/disponibilidade do time, acessos de teste dos provedores, contas/permissões pendentes e requisitos oficiais de submissão em #17.
- **Hipótese de valor:** a jornada conversacional facilita descoberta/compra e ajuda o lojista a interpretar resultados. Medir com usuários; não apresentar melhoria de conversão como resultado comprovado.
- **Riscos:** dependências externas, concentração de revisão em Thiago e integração tardia. Preparar contratos cedo, revisar PRs e demonstrar incrementos semanalmente.

Cada história tem critérios específicos; toda entrega atende à [Definition of Done](definition-of-done.md). Mudanças de escopo precisam aparecer na issue, na RFC, neste documento e na meta correspondente.
