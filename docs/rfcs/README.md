# RFCs do Boopay

85 RFCs vinculadas às 85 issues existentes. Proposta técnica, escopo confirmado, execução, revisão e aceite são estados diferentes. Consulte a issue para andamento real; esta sincronização documental não conclui nenhum card.

## Como usar

1. Localize a RFC, a história/habilitador e a sprint no índice.
2. Confira dependências, escopo e abordagem; registre decisão/revisor antes de aplicar mudança relevante.
3. Use branch e PR, documento do autor e evidências reais. Proposta/documentação parcial usa `Refs #N`; `Closes #N` exige aceite integral.
4. Aplique a [DoD](../definition-of-done.md) e o [acordo do time](../acordo-trabalho.md). Aprovar a RFC não comprova implementação.

## Planejamento vigente em 14/10/2026

| Meta | Tarefas | Quadro |
| --- | ---: | --- |
| S1 — Fundação integrada | 40 | [Project](https://github.com/users/Pedro-Lucas001/projects/2/views/8) |
| S2 — Compra conversacional | 20 | [Project](https://github.com/users/Pedro-Lucas001/projects/2/views/9) |
| S3 — Produto completo e homologação | 21 | [Project](https://github.com/users/Pedro-Lucas001/projects/2/views/10) |
| Entrega final | 2 | [Project](https://github.com/users/Pedro-Lucas001/projects/2/views/11) |
| Futuro — #20 e #21 | 2 | [Project](https://github.com/users/Pedro-Lucas001/projects/2/views/7) |

Os marcos M1–M5 nos documentos antigos identificam a área/etapa original; **Sprint vigente** é a alocação semanal atual. Multiloja/CDP/multitoque entraram na entrega. Os detalhes e os preparativos entre semanas estão em [docs/sprints](../sprints/README.md).

## Índice por issue

Responsáveis abaixo refletem o planejamento confirmado e campos disponíveis em 14/10. Alex tem responsabilidade textual confirmada, com atribuição nativa pendente. Conta da Letícia e demais campos vazios não são preenchidos por suposição.

| RFC | Issue | Entrega | Responsável | Sprint | História/habilitador |
| --- | --- | --- | --- | --- | --- |
| [RB-001](./RB-001.md) | [#1](https://github.com/Pedro-Lucas001/boopay/issues/1) | Definir critérios de aceite do plugin WooCommerce | @ThiagoVenturaV | S1 — Fundação integrada | [US-01](../backlog.md#us-01) |
| [RB-002](./RB-002.md) | [#2](https://github.com/Pedro-Lucas001/boopay/issues/2) | Preparar fluxo de contribuição e verificações do repositório | @ThiagoVenturaV | S1 — Fundação integrada | [US-01](../backlog.md#us-01) |
| [RB-003](./RB-003.md) | [#58](https://github.com/Pedro-Lucas001/boopay/issues/58) | Criar índice e modelo de documentação | @mluisacarvalho | S1 — Fundação integrada | [US-01](../backlog.md#us-01) |
| [RB-004](./RB-004.md) | [#22](https://github.com/Pedro-Lucas001/boopay/issues/22) | Preparar loja limpa e backend mínimo de desenvolvimento | A confirmar na issue | S1 — Fundação integrada | [US-01](../backlog.md#us-01) |
| [RB-005](./RB-005.md) | [#36](https://github.com/Pedro-Lucas001/boopay/issues/36) | Definir contrato versionado plugin–API e exemplos | @Pedro-Lucas001 | S1 — Fundação integrada | [US-01](../backlog.md#us-01) |
| [RB-006](./RB-006.md) | [#47](https://github.com/Pedro-Lucas001/boopay/issues/47) | Modelar lojas, integrações, catálogo e eventos | @cesab-ino | S1 — Fundação integrada | [US-01](../backlog.md#us-01) |
| [RB-007](./RB-007.md) | [#59](https://github.com/Pedro-Lucas001/boopay/issues/59) | Criar persistência mínima e fixtures de integração | @mluisacarvalho | S1 — Fundação integrada | [US-01](../backlog.md#us-01) |
| [RB-008](./RB-008.md) | [#23](https://github.com/Pedro-Lucas001/boopay/issues/23) | Criar estrutura do plugin e ciclo de ativação | A confirmar na issue | S1 — Fundação integrada | [US-01](../backlog.md#us-01) |
| [RB-009](./RB-009.md) | [#68](https://github.com/Pedro-Lucas001/boopay/issues/68) | Desenhar configuração e estados do plugin nativo | A confirmar na issue | S1 — Fundação integrada | [US-01](../backlog.md#us-01) |
| [RB-010](./RB-010.md) | [#77](https://github.com/Pedro-Lucas001/boopay/issues/77) | Implementar a tela administrativa do plugin | A confirmar na issue | S1 — Fundação integrada | [US-01](../backlog.md#us-01) |
| [RB-011](./RB-011.md) | [#3](https://github.com/Pedro-Lucas001/boopay/issues/3) | Implementar conexão e credenciais no backend mínimo | @ThiagoVenturaV | S1 — Fundação integrada | [US-01](../backlog.md#us-01) |
| [RB-012](./RB-012.md) | [#24](https://github.com/Pedro-Lucas001/boopay/issues/24) | Implementar conexão e desconexão no plugin | A confirmar na issue | S1 — Fundação integrada | [US-01](../backlog.md#us-01) |
| [RB-013](./RB-013.md) | [#4](https://github.com/Pedro-Lucas001/boopay/issues/4) | Implementar cliente HTTP assinado e validação da API | @ThiagoVenturaV | S1 — Fundação integrada | [US-01](../backlog.md#us-01) |
| [RB-014](./RB-014.md) | [#25](https://github.com/Pedro-Lucas001/boopay/issues/25) | Implementar sincronização inicial paginada do catálogo | A confirmar na issue | S1 — Fundação integrada | [US-01](../backlog.md#us-01) |
| [RB-015](./RB-015.md) | [#37](https://github.com/Pedro-Lucas001/boopay/issues/37) | Implementar atualizações e exclusões incrementais | @Pedro-Lucas001 | S1 — Fundação integrada | [US-01](../backlog.md#us-01) |
| [RB-016](./RB-016.md) | [#48](https://github.com/Pedro-Lucas001/boopay/issues/48) | Implementar ingestão idempotente do catálogo | @cesab-ino | S1 — Fundação integrada | [US-01](../backlog.md#us-01) |
| [RB-017](./RB-017.md) | [#26](https://github.com/Pedro-Lucas001/boopay/issues/26) | Implementar fila, retentativas e logs sanitizados | A confirmar na issue | S1 — Fundação integrada | [US-01](../backlog.md#us-01) |
| [RB-018](./RB-018.md) | [#78](https://github.com/Pedro-Lucas001/boopay/issues/78) | Implementar eventos de vitrine com consentimento | A confirmar na issue | S1 — Fundação integrada | [US-01](../backlog.md#us-01) |
| [RB-019](./RB-019.md) | [#60](https://github.com/Pedro-Lucas001/boopay/issues/60) | Implementar receptor de eventos e consulta de saúde | @mluisacarvalho | S1 — Fundação integrada | [US-01](../backlog.md#us-01) |
| [RB-020](./RB-020.md) | [#5](https://github.com/Pedro-Lucas001/boopay/issues/5) | Validar plugin em instalação limpa, HPOS e falhas | @ThiagoVenturaV | S1 — Fundação integrada | [US-01](../backlog.md#us-01) |
| [RB-021](./RB-021.md) | [#49](https://github.com/Pedro-Lucas001/boopay/issues/49) | Empacotar ZIP e revisar guia de instalação do plugin | @cesab-ino | S1 — Fundação integrada | [US-01](../backlog.md#us-01) |
| [RB-022](./RB-022.md) | [#6](https://github.com/Pedro-Lucas001/boopay/issues/6) | Preparar demonstração e evidências do plugin WooCommerce | @ThiagoVenturaV | S1 — Fundação integrada | [US-01](../backlog.md#us-01) |
| [RB-023](./RB-023.md) | [#7](https://github.com/Pedro-Lucas001/boopay/issues/7) | Registrar arquitetura e decisões do desenvolvimento | @ThiagoVenturaV | S1 — Fundação integrada | [HAB-01](../backlog.md#hab-01) |
| [RB-024](./RB-024.md) | [#50](https://github.com/Pedro-Lucas001/boopay/issues/50) | Implementar PostgreSQL transacional e migrations | @cesab-ino | S1 — Fundação integrada | [HAB-01](../backlog.md#hab-01) |
| [RB-025](./RB-025.md) | [#38](https://github.com/Pedro-Lucas001/boopay/issues/38) | Implementar Firestore para estado operacional | @Pedro-Lucas001 | S1 — Fundação integrada | [HAB-01](../backlog.md#hab-01) |
| [RB-026](./RB-026.md) | [#61](https://github.com/Pedro-Lucas001/boopay/issues/61) | Implementar histórico e agregações no BigQuery | @mluisacarvalho | S1 — Fundação integrada | [HAB-01](../backlog.md#hab-01) |
| [RB-027](./RB-027.md) | [#51](https://github.com/Pedro-Lucas001/boopay/issues/51) | Implementar identidade, consentimentos e exclusão | @cesab-ino | S1 — Fundação integrada | [HAB-01](../backlog.md#hab-01) |
| [RB-028](./RB-028.md) | [#39](https://github.com/Pedro-Lucas001/boopay/issues/39) | Implementar APIs de catálogo, perfil e métricas | @AlexLeandro00 (campo nativo pendente) | S1 — Fundação integrada | [HAB-01](../backlog.md#hab-01) |
| [RB-029](./RB-029.md) | [#69](https://github.com/Pedro-Lucas001/boopay/issues/69) | Definir sistema visual e componentes reutilizáveis | A confirmar na issue | S1 — Fundação integrada | [US-02](../backlog.md#us-02) |
| [RB-030](./RB-030.md) | [#79](https://github.com/Pedro-Lucas001/boopay/issues/79) | Implementar estrutura do frontend e navegação | A confirmar na issue | S1 — Fundação integrada | [US-02](../backlog.md#us-02) |
| [RB-031](./RB-031.md) | [#70](https://github.com/Pedro-Lucas001/boopay/issues/70) | Implementar tela de integrações e conexão da loja | A confirmar na issue | S1 — Fundação integrada | [US-02](../backlog.md#us-02) |
| [RB-032](./RB-032.md) | [#40](https://github.com/Pedro-Lucas001/boopay/issues/40) | Implementar projeção de perfil e linha do tempo | @Pedro-Lucas001 | S1 — Fundação integrada | [HAB-01](../backlog.md#hab-01) |
| [RB-033](./RB-033.md) | [#62](https://github.com/Pedro-Lucas001/boopay/issues/62) | Definir métricas e consultas do dashboard | @mluisacarvalho | S1 — Fundação integrada | [HAB-01](../backlog.md#hab-01) |
| [RB-034](./RB-034.md) | [#27](https://github.com/Pedro-Lucas001/boopay/issues/27) | Implementar observabilidade e diagnóstico básico | @AlexLeandro00 (campo nativo pendente) | S1 — Fundação integrada | [HAB-01](../backlog.md#hab-01) |
| [RB-035](./RB-035.md) | [#28](https://github.com/Pedro-Lucas001/boopay/issues/28) | Implementar conector Shopify de catálogo e eventos | @AlexLeandro00 (campo nativo pendente) | S2 — Compra conversacional | [US-03](../backlog.md#us-03) |
| [RB-036](./RB-036.md) | [#8](https://github.com/Pedro-Lucas001/boopay/issues/8) | Implementar cotação e pedido pelo adaptador Shopify | @AlexLeandro00 (campo nativo pendente) | S2 — Compra conversacional | [US-03](../backlog.md#us-03) |
| [RB-037](./RB-037.md) | [#29](https://github.com/Pedro-Lucas001/boopay/issues/29) | Implementar conector VTEX de catálogo e eventos | A confirmar na issue | S2 — Compra conversacional | [US-03](../backlog.md#us-03) |
| [RB-038](./RB-038.md) | [#9](https://github.com/Pedro-Lucas001/boopay/issues/9) | Implementar cotação e pedido pelo adaptador VTEX | @ThiagoVenturaV | S2 — Compra conversacional | [US-03](../backlog.md#us-03) |
| [RB-039](./RB-039.md) | [#41](https://github.com/Pedro-Lucas001/boopay/issues/41) | Integrar contrato versionado do GEO Readiness Audit | @Pedro-Lucas001 | S2 — Compra conversacional | [US-04](../backlog.md#us-04) |
| [RB-040](./RB-040.md) | [#52](https://github.com/Pedro-Lucas001/boopay/issues/52) | Implementar prontidão e elegibilidade do catálogo | @cesab-ino | S2 — Compra conversacional | [US-04](../backlog.md#us-04) |
| [RB-041](./RB-041.md) | [#71](https://github.com/Pedro-Lucas001/boopay/issues/71) | Implementar painel GEO e prontidão de produtos | A confirmar na issue | S2 — Compra conversacional | [US-04](../backlog.md#us-04) |
| [RB-042](./RB-042.md) | [#10](https://github.com/Pedro-Lucas001/boopay/issues/10) | Criar camada de IA e contratos de ferramentas | @ThiagoVenturaV | S1 — Fundação integrada | [US-05](../backlog.md#us-05) |
| [RB-043](./RB-043.md) | [#30](https://github.com/Pedro-Lucas001/boopay/issues/30) | Integrar GPT e Gemini e validar equivalência | A confirmar na issue | S2 — Compra conversacional | [US-05](../backlog.md#us-05) |
| [RB-044](./RB-044.md) | [#42](https://github.com/Pedro-Lucas001/boopay/issues/42) | Implementar embeddings e recuperação de catálogo | @Pedro-Lucas001 | S1 — Fundação integrada | [US-05](../backlog.md#us-05) |
| [RB-045](./RB-045.md) | [#11](https://github.com/Pedro-Lucas001/boopay/issues/11) | Implementar recomendação com catálogo e perfil | @ThiagoVenturaV | S2 — Compra conversacional | [US-05](../backlog.md#us-05) |
| [RB-046](./RB-046.md) | [#31](https://github.com/Pedro-Lucas001/boopay/issues/31) | Implementar Checkout Core e máquina de estados | A confirmar na issue | S1 — Fundação integrada | [US-06](../backlog.md#us-06) |
| [RB-047](./RB-047.md) | [#12](https://github.com/Pedro-Lucas001/boopay/issues/12) | Implementar cotação autoritativa WooCommerce | @ThiagoVenturaV | S2 — Compra conversacional | [US-06](../backlog.md#us-06) |
| [RB-048](./RB-048.md) | [#32](https://github.com/Pedro-Lucas001/boopay/issues/32) | Implementar criação e recuperação de pedido WooCommerce | A confirmar na issue | S2 — Compra conversacional | [US-06](../backlog.md#us-06) |
| [RB-049](./RB-049.md) | [#80](https://github.com/Pedro-Lucas001/boopay/issues/80) | Implementar interface conversacional e revisão da compra | A confirmar na issue | S2 — Compra conversacional | [US-06](../backlog.md#us-06) |
| [RB-050](./RB-050.md) | [#33](https://github.com/Pedro-Lucas001/boopay/issues/33) | Implementar Stripe em sandbox e callbacks | A confirmar na issue | S2 — Compra conversacional | [US-06](../backlog.md#us-06) |
| [RB-051](./RB-051.md) | [#81](https://github.com/Pedro-Lucas001/boopay/issues/81) | Implementar Google Pay de teste no checkout | A confirmar na issue | S2 — Compra conversacional | [US-06](../backlog.md#us-06) |
| [RB-052](./RB-052.md) | [#53](https://github.com/Pedro-Lucas001/boopay/issues/53) | Implementar conciliação, cancelamento e reembolso | @cesab-ino | S2 — Compra conversacional | [US-06](../backlog.md#us-06) |
| [RB-053](./RB-053.md) | [#13](https://github.com/Pedro-Lucas001/boopay/issues/13) | Implementar adaptador ACP sobre Checkout Core | @ThiagoVenturaV | S2 — Compra conversacional | [US-07](../backlog.md#us-07) |
| [RB-054](./RB-054.md) | [#34](https://github.com/Pedro-Lucas001/boopay/issues/34) | Implementar adaptador UCP sobre Checkout Core | A confirmar na issue | S2 — Compra conversacional | [US-07](../backlog.md#us-07) |
| [RB-055](./RB-055.md) | [#43](https://github.com/Pedro-Lucas001/boopay/issues/43) | Implementar feeds e descoberta do catálogo agêntico | @Pedro-Lucas001 | S2 — Compra conversacional | [US-07](../backlog.md#us-07) |
| [RB-056](./RB-056.md) | [#72](https://github.com/Pedro-Lucas001/boopay/issues/72) | Identificar superfícies e evidências reais ou simuladas | A confirmar na issue | S2 — Compra conversacional | [US-07](../backlog.md#us-07) |
| [RB-057](./RB-057.md) | [#63](https://github.com/Pedro-Lucas001/boopay/issues/63) | Modelar carrinho, abandono e jornada analítica | @mluisacarvalho | S1 — Fundação integrada | [US-08](../backlog.md#us-08) |
| [RB-058](./RB-058.md) | [#44](https://github.com/Pedro-Lucas001/boopay/issues/44) | Implementar funil e atribuição da jornada | @Pedro-Lucas001 | S2 — Compra conversacional | [US-08](../backlog.md#us-08) |
| [RB-059](./RB-059.md) | [#54](https://github.com/Pedro-Lucas001/boopay/issues/54) | Completar os dados do perfil 360 do MVP | @cesab-ino | S3 — Produto completo e homologação | [US-08](../backlog.md#us-08) |
| [RB-060](./RB-060.md) | [#73](https://github.com/Pedro-Lucas001/boopay/issues/73) | Implementar telas do perfil 360 e exclusão | A confirmar na issue | S3 — Produto completo e homologação | [US-08](../backlog.md#us-08) |
| [RB-061](./RB-061.md) | [#82](https://github.com/Pedro-Lucas001/boopay/issues/82) | Implementar visão executiva e receita do dashboard | A confirmar na issue | S3 — Produto completo e homologação | [US-08](../backlog.md#us-08) |
| [RB-062](./RB-062.md) | [#74](https://github.com/Pedro-Lucas001/boopay/issues/74) | Implementar dashboard de carrinhos e abandono | A confirmar na issue | S3 — Produto completo e homologação | [US-08](../backlog.md#us-08) |
| [RB-063](./RB-063.md) | [#83](https://github.com/Pedro-Lucas001/boopay/issues/83) | Implementar produtos, filtros e exportação | A confirmar na issue | S3 — Produto completo e homologação | [US-08](../backlog.md#us-08) |
| [RB-064](./RB-064.md) | [#75](https://github.com/Pedro-Lucas001/boopay/issues/75) | Completar dashboard GEO, protocolos e atribuição | A confirmar na issue | S3 — Produto completo e homologação | [US-08](../backlog.md#us-08) |
| [RB-065](./RB-065.md) | [#84](https://github.com/Pedro-Lucas001/boopay/issues/84) | Exibir qualidade, latência, falhas e custo de IA | A confirmar na issue | S3 — Produto completo e homologação | [US-08](../backlog.md#us-08) |
| [RB-066](./RB-066.md) | [#14](https://github.com/Pedro-Lucas001/boopay/issues/14) | Automatizar jornada principal do MVP em sandbox | @ThiagoVenturaV | S3 — Produto completo e homologação | [HAB-02](../backlog.md#hab-02) |
| [RB-067](./RB-067.md) | [#35](https://github.com/Pedro-Lucas001/boopay/issues/35) | Testar falhas, idempotência e recuperação | @AlexLeandro00 (campo nativo pendente) | S3 — Produto completo e homologação | [HAB-02](../backlog.md#hab-02) |
| [RB-068](./RB-068.md) | [#15](https://github.com/Pedro-Lucas001/boopay/issues/15) | Verificar autorização, isolamento e proteção de dados | @ThiagoVenturaV | S3 — Produto completo e homologação | [HAB-02](../backlog.md#hab-02) |
| [RB-069](./RB-069.md) | [#76](https://github.com/Pedro-Lucas001/boopay/issues/76) | Revisar usabilidade, responsividade e acessibilidade | A confirmar na issue | S3 — Produto completo e homologação | [HAB-02](../backlog.md#hab-02) |
| [RB-070](./RB-070.md) | [#45](https://github.com/Pedro-Lucas001/boopay/issues/45) | Consolidar README e guias das frentes | @Pedro-Lucas001 | S3 — Produto completo e homologação | [HAB-03](../backlog.md#hab-03) |
| [RB-071](./RB-071.md) | [#55](https://github.com/Pedro-Lucas001/boopay/issues/55) | Organizar registro individual e consolidado de Prompt Ops | @cesab-ino | S3 — Produto completo e homologação | [HAB-03](../backlog.md#hab-03) |
| [RB-072](./RB-072.md) | [#64](https://github.com/Pedro-Lucas001/boopay/issues/64) | Produzir documento de dois prompts que falharam | @mluisacarvalho | S3 — Produto completo e homologação | [HAB-03](../backlog.md#hab-03) |
| [RB-073](./RB-073.md) | [#65](https://github.com/Pedro-Lucas001/boopay/issues/65) | Calcular custos e viabilidade econômica | @mluisacarvalho | S3 — Produto completo e homologação | [HAB-03](../backlog.md#hab-03) |
| [RB-074](./RB-074.md) | [#85](https://github.com/Pedro-Lucas001/boopay/issues/85) | Criar slides e roteiro de apresentação do MVP | A confirmar na issue | S3 — Produto completo e homologação | [HAB-03](../backlog.md#hab-03) |
| [RB-075](./RB-075.md) | [#16](https://github.com/Pedro-Lucas001/boopay/issues/16) | Ensaiar apresentação e preparar plano B | @ThiagoVenturaV | S3 — Produto completo e homologação | [HAB-03](../backlog.md#hab-03) |
| [RB-076](./RB-076.md) | [#56](https://github.com/Pedro-Lucas001/boopay/issues/56) | Congelar versão e organizar pacote do MVP | @cesab-ino | S3 — Produto completo e homologação | [HAB-03](../backlog.md#hab-03) |
| [RB-077](./RB-077.md) | [#17](https://github.com/Pedro-Lucas001/boopay/issues/17) | Registrar requisitos de submissão da entrega | @ThiagoVenturaV | S1 — Fundação integrada | [HAB-03](../backlog.md#hab-03) |
| [RB-078](./RB-078.md) | [#46](https://github.com/Pedro-Lucas001/boopay/issues/46) | Reproduzir pacote em ambiente novo | @Pedro-Lucas001 | S3 — Produto completo e homologação | [HAB-03](../backlog.md#hab-03) |
| [RB-079](./RB-079.md) | [#18](https://github.com/Pedro-Lucas001/boopay/issues/18) | Submeter a entrega e guardar o comprovante | @ThiagoVenturaV | Entrega final | [HAB-03](../backlog.md#hab-03) |
| [RB-080](./RB-080.md) | [#66](https://github.com/Pedro-Lucas001/boopay/issues/66) | Registrar contribuições e retrospectiva | @mluisacarvalho | Entrega final | [HAB-03](../backlog.md#hab-03) |
| [RB-081](./RB-081.md) | [#19](https://github.com/Pedro-Lucas001/boopay/issues/19) | Implementar operação multiloja e isolamento de dados | @ThiagoVenturaV | S1 — Fundação integrada | [US-02](../backlog.md#us-02) |
| [RB-082](./RB-082.md) | [#20](https://github.com/Pedro-Lucas001/boopay/issues/20) | Especificar planos e cobrança SaaS futura | @ThiagoVenturaV | Futuro — fora da entrega de 04/11 | [US-09](../backlog.md#us-09) |
| [RB-083](./RB-083.md) | [#57](https://github.com/Pedro-Lucas001/boopay/issues/57) | Implementar CDP completo e identidade avançada | @cesab-ino | S3 — Produto completo e homologação | [US-08](../backlog.md#us-08) |
| [RB-084](./RB-084.md) | [#67](https://github.com/Pedro-Lucas001/boopay/issues/67) | Implementar rastreamento avançado e atribuição multitoque | @mluisacarvalho | S3 — Produto completo e homologação | [US-08](../backlog.md#us-08) |
| [RB-085](./RB-085.md) | [#21](https://github.com/Pedro-Lucas001/boopay/issues/21) | Mapear homologação e publicação em superfícies oficiais | @ThiagoVenturaV | Futuro — fora da entrega de 04/11 | [US-10](../backlog.md#us-10) |
