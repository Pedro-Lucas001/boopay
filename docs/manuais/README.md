# Manuais de execução do Boopay

85 tarefas, 85 roteiros específicos: 83 da entrega de novembro e 2 futuras. Abra seu card no Project, leia as instruções no corpo da issue e siga o manual correspondente. IDs RB e números de issue podem ser diferentes.

## Fluxo de trabalho

1. Confira responsável, meta, dependências e resultado da sua tarefa.
2. Leia **Onde trabalhar**: distingue arquivos existentes de caminhos propostos.
3. Crie a branch indicada, execute o passo a passo e valide os casos/aceite.
4. Documente sua execução em `docs/entregas/RB-XXX.md`, com autoria, decisões e evidências reais.
5. Abra PR para `main`, vincule a issue e peça revisão de outra pessoa. Review é entrega revisável; Done exige revisão, integração e validação.

Use o [tutorial pelo terminal](../../README.md), o [acordo do time](../acordo-trabalho.md), a [DoD](../definition-of-done.md) e o [modelo de entrega](../entregas/MODELO.md). Um manual orienta trabalho, sem afirmar que o código, acesso externo ou aceite já existem. Dependência bloqueada deve ser registrada no card.

## Critérios e histórico

Os critérios e marcações existentes foram preservados das issues consultadas em 16/10/2026. Responsáveis nativos, labels, milestones, estados e organização do Project não são alterados pela conversão. Registros específicos anexados às RFCs anteriores permanecem nos manuais; versões completas estão no histórico Git. `docs/rfcs/` mantém links de compatibilidade, sem ser o roteiro ativo.

O snapshot não é um status em tempo real: consulte a issue/Project. Tarefa encerrada não deve ser refeita automaticamente. Planos SaaS (#20) e homologação oficial (#21) permanecem futuras. Prazo registrado: versão integrada até 03/11 e submissão em 04/11/2026, America/Fortaleza.

## Índice por tarefa

| Manual | Issue | Entrega | Responsável na consulta | Meta planejada |
| --- | --- | --- | --- | --- |
| [RB-001](./RB-001.md) | [#1](https://github.com/Pedro-Lucas001/boopay/issues/1) | Definir critérios de aceite do plugin WooCommerce | @ThiagoVenturaV | S1 — Fundação integrada (14–20/10) |
| [RB-002](./RB-002.md) | [#2](https://github.com/Pedro-Lucas001/boopay/issues/2) | Preparar fluxo de contribuição e verificações do repositório | @ThiagoVenturaV | S1 — Fundação integrada (14–20/10) |
| [RB-003](./RB-003.md) | [#58](https://github.com/Pedro-Lucas001/boopay/issues/58) | Criar índice e modelo de documentação | @mluisacarvalho | S1 — Fundação integrada (14–20/10) |
| [RB-004](./RB-004.md) | [#22](https://github.com/Pedro-Lucas001/boopay/issues/22) | Preparar loja limpa e backend mínimo de desenvolvimento | Consulte a divisão confirmada no card/acordo; conta não atribuída na consulta. | S1 — Fundação integrada (14–20/10) |
| [RB-005](./RB-005.md) | [#36](https://github.com/Pedro-Lucas001/boopay/issues/36) | Definir contrato versionado plugin–API e exemplos | @Pedro-Lucas001 | S1 — Fundação integrada (14–20/10) |
| [RB-006](./RB-006.md) | [#47](https://github.com/Pedro-Lucas001/boopay/issues/47) | Modelar lojas, integrações, catálogo e eventos | @cesab-ino | S1 — Fundação integrada (14–20/10) |
| [RB-007](./RB-007.md) | [#59](https://github.com/Pedro-Lucas001/boopay/issues/59) | Criar persistência mínima e fixtures de integração | @mluisacarvalho | S1 — Fundação integrada (14–20/10) |
| [RB-008](./RB-008.md) | [#23](https://github.com/Pedro-Lucas001/boopay/issues/23) | Criar estrutura do plugin e ciclo de ativação | Consulte a divisão confirmada no card/acordo; conta não atribuída na consulta. | S1 — Fundação integrada (14–20/10) |
| [RB-009](./RB-009.md) | [#68](https://github.com/Pedro-Lucas001/boopay/issues/68) | Desenhar configuração e estados do plugin nativo | Consulte a divisão confirmada no card/acordo; conta não atribuída na consulta. | S1 — Fundação integrada (14–20/10) |
| [RB-010](./RB-010.md) | [#77](https://github.com/Pedro-Lucas001/boopay/issues/77) | Implementar a tela administrativa do plugin | Consulte a divisão confirmada no card/acordo; conta não atribuída na consulta. | S1 — Fundação integrada (14–20/10) |
| [RB-011](./RB-011.md) | [#3](https://github.com/Pedro-Lucas001/boopay/issues/3) | Implementar conexão e credenciais no backend mínimo | @ThiagoVenturaV | S1 — Fundação integrada (14–20/10) |
| [RB-012](./RB-012.md) | [#24](https://github.com/Pedro-Lucas001/boopay/issues/24) | Implementar conexão e desconexão no plugin | Consulte a divisão confirmada no card/acordo; conta não atribuída na consulta. | S1 — Fundação integrada (14–20/10) |
| [RB-013](./RB-013.md) | [#4](https://github.com/Pedro-Lucas001/boopay/issues/4) | Implementar cliente HTTP assinado e validação da API | @ThiagoVenturaV | S1 — Fundação integrada (14–20/10) |
| [RB-014](./RB-014.md) | [#25](https://github.com/Pedro-Lucas001/boopay/issues/25) | Implementar sincronização inicial paginada do catálogo | Consulte a divisão confirmada no card/acordo; conta não atribuída na consulta. | S1 — Fundação integrada (14–20/10) |
| [RB-015](./RB-015.md) | [#37](https://github.com/Pedro-Lucas001/boopay/issues/37) | Implementar atualizações e exclusões incrementais | @Pedro-Lucas001 | S1 — Fundação integrada (14–20/10) |
| [RB-016](./RB-016.md) | [#48](https://github.com/Pedro-Lucas001/boopay/issues/48) | Implementar ingestão idempotente do catálogo | @cesab-ino | S1 — Fundação integrada (14–20/10) |
| [RB-017](./RB-017.md) | [#26](https://github.com/Pedro-Lucas001/boopay/issues/26) | Implementar fila, retentativas e logs sanitizados | Consulte a divisão confirmada no card/acordo; conta não atribuída na consulta. | S1 — Fundação integrada (14–20/10) |
| [RB-018](./RB-018.md) | [#78](https://github.com/Pedro-Lucas001/boopay/issues/78) | Implementar eventos de vitrine com consentimento | Consulte a divisão confirmada no card/acordo; conta não atribuída na consulta. | S1 — Fundação integrada (14–20/10) |
| [RB-019](./RB-019.md) | [#60](https://github.com/Pedro-Lucas001/boopay/issues/60) | Implementar receptor de eventos e consulta de saúde | @mluisacarvalho | S1 — Fundação integrada (14–20/10) |
| [RB-020](./RB-020.md) | [#5](https://github.com/Pedro-Lucas001/boopay/issues/5) | Validar plugin em instalação limpa, HPOS e falhas | @ThiagoVenturaV | S1 — Fundação integrada (14–20/10) |
| [RB-021](./RB-021.md) | [#49](https://github.com/Pedro-Lucas001/boopay/issues/49) | Empacotar ZIP e revisar guia de instalação do plugin | @cesab-ino | S1 — Fundação integrada (14–20/10) |
| [RB-022](./RB-022.md) | [#6](https://github.com/Pedro-Lucas001/boopay/issues/6) | Preparar demonstração e evidências do plugin WooCommerce | @ThiagoVenturaV | S1 — Fundação integrada (14–20/10) |
| [RB-023](./RB-023.md) | [#7](https://github.com/Pedro-Lucas001/boopay/issues/7) | Registrar arquitetura e decisões do desenvolvimento | @ThiagoVenturaV | S1 — Fundação integrada (14–20/10) |
| [RB-024](./RB-024.md) | [#50](https://github.com/Pedro-Lucas001/boopay/issues/50) | Implementar PostgreSQL transacional e migrations | @cesab-ino | S1 — Fundação integrada (14–20/10) |
| [RB-025](./RB-025.md) | [#38](https://github.com/Pedro-Lucas001/boopay/issues/38) | Implementar Firestore para estado operacional | @Pedro-Lucas001 | S1 — Fundação integrada (14–20/10) |
| [RB-026](./RB-026.md) | [#61](https://github.com/Pedro-Lucas001/boopay/issues/61) | Implementar histórico e agregações no BigQuery | @mluisacarvalho | S1 — Fundação integrada (14–20/10) |
| [RB-027](./RB-027.md) | [#51](https://github.com/Pedro-Lucas001/boopay/issues/51) | Implementar identidade, consentimentos e exclusão | @cesab-ino | S1 — Fundação integrada (14–20/10) |
| [RB-028](./RB-028.md) | [#39](https://github.com/Pedro-Lucas001/boopay/issues/39) | Implementar APIs de catálogo, perfil e métricas | @AlexLeandro00 (responsável confirmado no texto do card); Assignees na consulta: @Pedro-Lucas001. Divergência de atribuição nativa a conferir com Pedro. | S1 — Fundação integrada (14–20/10) |
| [RB-029](./RB-029.md) | [#69](https://github.com/Pedro-Lucas001/boopay/issues/69) | Definir sistema visual e componentes reutilizáveis | Consulte a divisão confirmada no card/acordo; conta não atribuída na consulta. | S1 — Fundação integrada (14–20/10) |
| [RB-030](./RB-030.md) | [#79](https://github.com/Pedro-Lucas001/boopay/issues/79) | Implementar estrutura do frontend e navegação | Consulte a divisão confirmada no card/acordo; conta não atribuída na consulta. | S1 — Fundação integrada (14–20/10) |
| [RB-031](./RB-031.md) | [#70](https://github.com/Pedro-Lucas001/boopay/issues/70) | Implementar tela de integrações e conexão da loja | Consulte a divisão confirmada no card/acordo; conta não atribuída na consulta. | S1 — Fundação integrada (14–20/10) |
| [RB-032](./RB-032.md) | [#40](https://github.com/Pedro-Lucas001/boopay/issues/40) | Implementar projeção de perfil e linha do tempo | @Pedro-Lucas001 | S1 — Fundação integrada (14–20/10) |
| [RB-033](./RB-033.md) | [#62](https://github.com/Pedro-Lucas001/boopay/issues/62) | Definir métricas e consultas do dashboard | @mluisacarvalho | S1 — Fundação integrada (14–20/10) |
| [RB-034](./RB-034.md) | [#27](https://github.com/Pedro-Lucas001/boopay/issues/27) | Implementar observabilidade e diagnóstico básico | @AlexLeandro00 (confirmado no card; atribuição nativa a conferir) | S1 — Fundação integrada (14–20/10) |
| [RB-035](./RB-035.md) | [#28](https://github.com/Pedro-Lucas001/boopay/issues/28) | Implementar conector Shopify de catálogo e eventos | @AlexLeandro00 (confirmado no card; atribuição nativa a conferir) | S2 — Compra conversacional (21–27/10) |
| [RB-036](./RB-036.md) | [#8](https://github.com/Pedro-Lucas001/boopay/issues/8) | Implementar cotação e pedido pelo adaptador Shopify | @AlexLeandro00 (responsável confirmado no texto do card); Assignees na consulta: @ThiagoVenturaV. Divergência de atribuição nativa a conferir com Pedro. | S2 — Compra conversacional (21–27/10) |
| [RB-037](./RB-037.md) | [#29](https://github.com/Pedro-Lucas001/boopay/issues/29) | Implementar conector VTEX de catálogo e eventos | Consulte a divisão confirmada no card/acordo; conta não atribuída na consulta. | S2 — Compra conversacional (21–27/10) |
| [RB-038](./RB-038.md) | [#9](https://github.com/Pedro-Lucas001/boopay/issues/9) | Implementar cotação e pedido pelo adaptador VTEX | @ThiagoVenturaV | S2 — Compra conversacional (21–27/10) |
| [RB-039](./RB-039.md) | [#41](https://github.com/Pedro-Lucas001/boopay/issues/41) | Integrar contrato versionado do GEO Readiness Audit | @Pedro-Lucas001 | S2 — Compra conversacional (21–27/10) |
| [RB-040](./RB-040.md) | [#52](https://github.com/Pedro-Lucas001/boopay/issues/52) | Implementar prontidão e elegibilidade do catálogo | @cesab-ino | S2 — Compra conversacional (21–27/10) |
| [RB-041](./RB-041.md) | [#71](https://github.com/Pedro-Lucas001/boopay/issues/71) | Implementar painel GEO e prontidão de produtos | Consulte a divisão confirmada no card/acordo; conta não atribuída na consulta. | S2 — Compra conversacional (21–27/10) |
| [RB-042](./RB-042.md) | [#10](https://github.com/Pedro-Lucas001/boopay/issues/10) | Criar camada de IA e contratos de ferramentas | @ThiagoVenturaV | S1 — Fundação integrada (14–20/10) |
| [RB-043](./RB-043.md) | [#30](https://github.com/Pedro-Lucas001/boopay/issues/30) | Integrar GPT e Gemini e validar equivalência | Consulte a divisão confirmada no card/acordo; conta não atribuída na consulta. | S2 — Compra conversacional (21–27/10) |
| [RB-044](./RB-044.md) | [#42](https://github.com/Pedro-Lucas001/boopay/issues/42) | Implementar embeddings e recuperação de catálogo | @Pedro-Lucas001 | S1 — Fundação integrada (14–20/10) |
| [RB-045](./RB-045.md) | [#11](https://github.com/Pedro-Lucas001/boopay/issues/11) | Implementar recomendação com catálogo e perfil | @ThiagoVenturaV | S2 — Compra conversacional (21–27/10) |
| [RB-046](./RB-046.md) | [#31](https://github.com/Pedro-Lucas001/boopay/issues/31) | Implementar Checkout Core e máquina de estados | Consulte a divisão confirmada no card/acordo; conta não atribuída na consulta. | S1 — Fundação integrada (14–20/10) |
| [RB-047](./RB-047.md) | [#12](https://github.com/Pedro-Lucas001/boopay/issues/12) | Implementar cotação autoritativa WooCommerce | @ThiagoVenturaV | S2 — Compra conversacional (21–27/10) |
| [RB-048](./RB-048.md) | [#32](https://github.com/Pedro-Lucas001/boopay/issues/32) | Implementar criação e recuperação de pedido WooCommerce | Consulte a divisão confirmada no card/acordo; conta não atribuída na consulta. | S2 — Compra conversacional (21–27/10) |
| [RB-049](./RB-049.md) | [#80](https://github.com/Pedro-Lucas001/boopay/issues/80) | Implementar interface conversacional e revisão da compra | Consulte a divisão confirmada no card/acordo; conta não atribuída na consulta. | S2 — Compra conversacional (21–27/10) |
| [RB-050](./RB-050.md) | [#33](https://github.com/Pedro-Lucas001/boopay/issues/33) | Implementar Stripe em sandbox e callbacks | Consulte a divisão confirmada no card/acordo; conta não atribuída na consulta. | S2 — Compra conversacional (21–27/10) |
| [RB-051](./RB-051.md) | [#81](https://github.com/Pedro-Lucas001/boopay/issues/81) | Implementar Google Pay de teste no checkout | Consulte a divisão confirmada no card/acordo; conta não atribuída na consulta. | S2 — Compra conversacional (21–27/10) |
| [RB-052](./RB-052.md) | [#53](https://github.com/Pedro-Lucas001/boopay/issues/53) | Implementar conciliação, cancelamento e reembolso | @cesab-ino | S2 — Compra conversacional (21–27/10) |
| [RB-053](./RB-053.md) | [#13](https://github.com/Pedro-Lucas001/boopay/issues/13) | Implementar adaptador ACP sobre Checkout Core | @ThiagoVenturaV | S2 — Compra conversacional (21–27/10) |
| [RB-054](./RB-054.md) | [#34](https://github.com/Pedro-Lucas001/boopay/issues/34) | Implementar adaptador UCP sobre Checkout Core | Consulte a divisão confirmada no card/acordo; conta não atribuída na consulta. | S2 — Compra conversacional (21–27/10) |
| [RB-055](./RB-055.md) | [#43](https://github.com/Pedro-Lucas001/boopay/issues/43) | Implementar feeds e descoberta do catálogo agêntico | @Pedro-Lucas001 | S2 — Compra conversacional (21–27/10) |
| [RB-056](./RB-056.md) | [#72](https://github.com/Pedro-Lucas001/boopay/issues/72) | Identificar superfícies e evidências reais ou simuladas | Consulte a divisão confirmada no card/acordo; conta não atribuída na consulta. | S2 — Compra conversacional (21–27/10) |
| [RB-057](./RB-057.md) | [#63](https://github.com/Pedro-Lucas001/boopay/issues/63) | Modelar carrinho, abandono e jornada analítica | @mluisacarvalho | S1 — Fundação integrada (14–20/10) |
| [RB-058](./RB-058.md) | [#44](https://github.com/Pedro-Lucas001/boopay/issues/44) | Implementar funil e atribuição da jornada | @Pedro-Lucas001 | S2 — Compra conversacional (21–27/10) |
| [RB-059](./RB-059.md) | [#54](https://github.com/Pedro-Lucas001/boopay/issues/54) | Completar os dados do perfil 360 do MVP | @cesab-ino | S3 — Produto completo (28/10–03/11) |
| [RB-060](./RB-060.md) | [#73](https://github.com/Pedro-Lucas001/boopay/issues/73) | Implementar telas do perfil 360 e exclusão | Consulte a divisão confirmada no card/acordo; conta não atribuída na consulta. | S3 — Produto completo (28/10–03/11) |
| [RB-061](./RB-061.md) | [#82](https://github.com/Pedro-Lucas001/boopay/issues/82) | Implementar visão executiva e receita do dashboard | Consulte a divisão confirmada no card/acordo; conta não atribuída na consulta. | S3 — Produto completo (28/10–03/11) |
| [RB-062](./RB-062.md) | [#74](https://github.com/Pedro-Lucas001/boopay/issues/74) | Implementar dashboard de carrinhos e abandono | Consulte a divisão confirmada no card/acordo; conta não atribuída na consulta. | S3 — Produto completo (28/10–03/11) |
| [RB-063](./RB-063.md) | [#83](https://github.com/Pedro-Lucas001/boopay/issues/83) | Implementar produtos, filtros e exportação | Consulte a divisão confirmada no card/acordo; conta não atribuída na consulta. | S3 — Produto completo (28/10–03/11) |
| [RB-064](./RB-064.md) | [#75](https://github.com/Pedro-Lucas001/boopay/issues/75) | Completar dashboard GEO, protocolos e atribuição | Consulte a divisão confirmada no card/acordo; conta não atribuída na consulta. | S3 — Produto completo (28/10–03/11) |
| [RB-065](./RB-065.md) | [#84](https://github.com/Pedro-Lucas001/boopay/issues/84) | Exibir qualidade, latência, falhas e custo de IA | Consulte a divisão confirmada no card/acordo; conta não atribuída na consulta. | S3 — Produto completo (28/10–03/11) |
| [RB-066](./RB-066.md) | [#14](https://github.com/Pedro-Lucas001/boopay/issues/14) | Automatizar jornada principal do MVP em sandbox | @ThiagoVenturaV | S3 — Produto completo (28/10–03/11) |
| [RB-067](./RB-067.md) | [#35](https://github.com/Pedro-Lucas001/boopay/issues/35) | Testar falhas, idempotência e recuperação | @AlexLeandro00 (confirmado no card; atribuição nativa a conferir) | S3 — Produto completo (28/10–03/11) |
| [RB-068](./RB-068.md) | [#15](https://github.com/Pedro-Lucas001/boopay/issues/15) | Verificar autorização, isolamento e proteção de dados | @ThiagoVenturaV | S3 — Produto completo (28/10–03/11) |
| [RB-069](./RB-069.md) | [#76](https://github.com/Pedro-Lucas001/boopay/issues/76) | Revisar usabilidade, responsividade e acessibilidade | Consulte a divisão confirmada no card/acordo; conta não atribuída na consulta. | S3 — Produto completo (28/10–03/11) |
| [RB-070](./RB-070.md) | [#45](https://github.com/Pedro-Lucas001/boopay/issues/45) | Consolidar README e guias das frentes | @Pedro-Lucas001 | S3 — Produto completo (28/10–03/11) |
| [RB-071](./RB-071.md) | [#55](https://github.com/Pedro-Lucas001/boopay/issues/55) | Organizar registro individual e consolidado de Prompt Ops | @cesab-ino | S3 — Produto completo (28/10–03/11) |
| [RB-072](./RB-072.md) | [#64](https://github.com/Pedro-Lucas001/boopay/issues/64) | Produzir documento de dois prompts que falharam | @mluisacarvalho | S3 — Produto completo (28/10–03/11) |
| [RB-073](./RB-073.md) | [#65](https://github.com/Pedro-Lucas001/boopay/issues/65) | Calcular custos e viabilidade econômica | @mluisacarvalho | S3 — Produto completo (28/10–03/11) |
| [RB-074](./RB-074.md) | [#85](https://github.com/Pedro-Lucas001/boopay/issues/85) | Criar slides e roteiro de apresentação do MVP | Consulte a divisão confirmada no card/acordo; conta não atribuída na consulta. | S3 — Produto completo (28/10–03/11) |
| [RB-075](./RB-075.md) | [#16](https://github.com/Pedro-Lucas001/boopay/issues/16) | Ensaiar apresentação e preparar plano B | @ThiagoVenturaV | S3 — Produto completo (28/10–03/11) |
| [RB-076](./RB-076.md) | [#56](https://github.com/Pedro-Lucas001/boopay/issues/56) | Congelar versão e organizar pacote do MVP | @cesab-ino | S3 — Produto completo (28/10–03/11) |
| [RB-077](./RB-077.md) | [#17](https://github.com/Pedro-Lucas001/boopay/issues/17) | Registrar requisitos de submissão da entrega | @ThiagoVenturaV | S1 — Fundação integrada (14–20/10) |
| [RB-078](./RB-078.md) | [#46](https://github.com/Pedro-Lucas001/boopay/issues/46) | Reproduzir pacote em ambiente novo | @Pedro-Lucas001 | S3 — Produto completo (28/10–03/11) |
| [RB-079](./RB-079.md) | [#18](https://github.com/Pedro-Lucas001/boopay/issues/18) | Submeter a entrega e guardar o comprovante | @ThiagoVenturaV | Entrega — 04/11 |
| [RB-080](./RB-080.md) | [#66](https://github.com/Pedro-Lucas001/boopay/issues/66) | Registrar contribuições e retrospectiva | @mluisacarvalho | Entrega — 04/11 |
| [RB-081](./RB-081.md) | [#19](https://github.com/Pedro-Lucas001/boopay/issues/19) | Implementar operação multiloja e isolamento de dados | @ThiagoVenturaV | S1 — Fundação integrada (14–20/10) |
| [RB-082](./RB-082.md) | [#20](https://github.com/Pedro-Lucas001/boopay/issues/20) | Especificar planos e cobrança SaaS futura | @ThiagoVenturaV | Futuro — fora da entrega de 04/11 |
| [RB-083](./RB-083.md) | [#57](https://github.com/Pedro-Lucas001/boopay/issues/57) | Implementar CDP completo e identidade avançada | @cesab-ino | S3 — Produto completo (28/10–03/11) |
| [RB-084](./RB-084.md) | [#67](https://github.com/Pedro-Lucas001/boopay/issues/67) | Implementar rastreamento avançado e atribuição multitoque | @mluisacarvalho | S3 — Produto completo (28/10–03/11) |
| [RB-085](./RB-085.md) | [#21](https://github.com/Pedro-Lucas001/boopay/issues/21) | Mapear homologação e publicação em superfícies oficiais | @ThiagoVenturaV | Futuro — fora da entrega de 04/11 |
