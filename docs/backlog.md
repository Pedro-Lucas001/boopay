# Backlog por valor e rastreabilidade

Agrupamento elaborado em 14/10/2026 para revisão do time: **10 histórias de usuário e 3 habilitadores**, cobrindo as **85 issues existentes**, sem criar cópias ou sub-issues artificiais. São **83 tarefas na entrega de 04/11** e **2 futuras**. Não usar o número de cards como medida de esforço ou velocidade.

O objetivo e os critérios de cada grupo sintetizam as issues; o manual/issue mantém o aceite detalhado. Prioridade final cabe ao responsável pelo produto; os Developers conferem capacidade, decomposição e ordem na planning. A ordem abaixo segue dependências/valor, não atribui estimativas.

[Visão](visao-produto.md) · [DoD](definition-of-done.md) · [Sprints](sprints/README.md) · [JSON do planejamento](planejamento/backlog.json)

<a id="us-01"></a>
## US-01 — Conectar WooCommerce e disponibilizar catálogo/eventos

Como lojista, quero conectar minha loja WooCommerce ao Boopay para disponibilizar catálogo e eventos ao agente.

**Valor/ordenação sugerida:** Entregar uma capacidade da jornada confirmada; executar conforme dependências e meta semanal da tarefa.

**Critérios do agrupamento:**
- Conexão/desconexão autorizada e credenciais protegidas.
- Catálogo inicial e alterações sincronizados sem duplicar dados.
- Eventos com consentimento e diagnóstico de falhas verificáveis.
- Instalação limpa, pacote e roteiro de demonstração reproduzíveis.

**Dúvidas e dependências:** conferir os manuais vinculados; capacidade e acessos externos não são presumidos. Mudança de agrupamento não muda automaticamente escopo/status.

| Tarefa / issue | Entrega esperada | Responsável registrado | Meta | Manual |
| --- | --- | --- | --- | --- |
| [RB-001 / #1](https://github.com/Pedro-Lucas001/boopay/issues/1) | Definir critérios de aceite do plugin WooCommerce | @ThiagoVenturaV | S1 — Fundação integrada | [Manual](manuais/RB-001.md) |
| [RB-002 / #2](https://github.com/Pedro-Lucas001/boopay/issues/2) | Preparar fluxo de contribuição e verificações do repositório | @ThiagoVenturaV | S1 — Fundação integrada | [Manual](manuais/RB-002.md) |
| [RB-003 / #58](https://github.com/Pedro-Lucas001/boopay/issues/58) | Criar índice e modelo de documentação | @mluisacarvalho | S1 — Fundação integrada | [Manual](manuais/RB-003.md) |
| [RB-004 / #22](https://github.com/Pedro-Lucas001/boopay/issues/22) | Preparar loja limpa e backend mínimo de desenvolvimento | A confirmar na issue | S1 — Fundação integrada | [Manual](manuais/RB-004.md) |
| [RB-005 / #36](https://github.com/Pedro-Lucas001/boopay/issues/36) | Definir contrato versionado plugin–API e exemplos | @Pedro-Lucas001 | S1 — Fundação integrada | [Manual](manuais/RB-005.md) |
| [RB-006 / #47](https://github.com/Pedro-Lucas001/boopay/issues/47) | Modelar lojas, integrações, catálogo e eventos | @cesab-ino | S1 — Fundação integrada | [Manual](manuais/RB-006.md) |
| [RB-007 / #59](https://github.com/Pedro-Lucas001/boopay/issues/59) | Criar persistência mínima e fixtures de integração | @mluisacarvalho | S1 — Fundação integrada | [Manual](manuais/RB-007.md) |
| [RB-008 / #23](https://github.com/Pedro-Lucas001/boopay/issues/23) | Criar estrutura do plugin e ciclo de ativação | A confirmar na issue | S1 — Fundação integrada | [Manual](manuais/RB-008.md) |
| [RB-009 / #68](https://github.com/Pedro-Lucas001/boopay/issues/68) | Desenhar configuração e estados do plugin nativo | A confirmar na issue | S1 — Fundação integrada | [Manual](manuais/RB-009.md) |
| [RB-010 / #77](https://github.com/Pedro-Lucas001/boopay/issues/77) | Implementar a tela administrativa do plugin | A confirmar na issue | S1 — Fundação integrada | [Manual](manuais/RB-010.md) |
| [RB-011 / #3](https://github.com/Pedro-Lucas001/boopay/issues/3) | Implementar conexão e credenciais no backend mínimo | @ThiagoVenturaV | S1 — Fundação integrada | [Manual](manuais/RB-011.md) |
| [RB-012 / #24](https://github.com/Pedro-Lucas001/boopay/issues/24) | Implementar conexão e desconexão no plugin | A confirmar na issue | S1 — Fundação integrada | [Manual](manuais/RB-012.md) |
| [RB-013 / #4](https://github.com/Pedro-Lucas001/boopay/issues/4) | Implementar cliente HTTP assinado e validação da API | @ThiagoVenturaV | S1 — Fundação integrada | [Manual](manuais/RB-013.md) |
| [RB-014 / #25](https://github.com/Pedro-Lucas001/boopay/issues/25) | Implementar sincronização inicial paginada do catálogo | A confirmar na issue | S1 — Fundação integrada | [Manual](manuais/RB-014.md) |
| [RB-015 / #37](https://github.com/Pedro-Lucas001/boopay/issues/37) | Implementar atualizações e exclusões incrementais | @Pedro-Lucas001 | S1 — Fundação integrada | [Manual](manuais/RB-015.md) |
| [RB-016 / #48](https://github.com/Pedro-Lucas001/boopay/issues/48) | Implementar ingestão idempotente do catálogo | @cesab-ino | S1 — Fundação integrada | [Manual](manuais/RB-016.md) |
| [RB-017 / #26](https://github.com/Pedro-Lucas001/boopay/issues/26) | Implementar fila, retentativas e logs sanitizados | A confirmar na issue | S1 — Fundação integrada | [Manual](manuais/RB-017.md) |
| [RB-018 / #78](https://github.com/Pedro-Lucas001/boopay/issues/78) | Implementar eventos de vitrine com consentimento | A confirmar na issue | S1 — Fundação integrada | [Manual](manuais/RB-018.md) |
| [RB-019 / #60](https://github.com/Pedro-Lucas001/boopay/issues/60) | Implementar receptor de eventos e consulta de saúde | @mluisacarvalho | S1 — Fundação integrada | [Manual](manuais/RB-019.md) |
| [RB-020 / #5](https://github.com/Pedro-Lucas001/boopay/issues/5) | Validar plugin em instalação limpa, HPOS e falhas | @ThiagoVenturaV | S1 — Fundação integrada | [Manual](manuais/RB-020.md) |
| [RB-021 / #49](https://github.com/Pedro-Lucas001/boopay/issues/49) | Empacotar ZIP e revisar guia de instalação do plugin | @cesab-ino | S1 — Fundação integrada | [Manual](manuais/RB-021.md) |
| [RB-022 / #6](https://github.com/Pedro-Lucas001/boopay/issues/6) | Preparar demonstração e evidências do plugin WooCommerce | @ThiagoVenturaV | S1 — Fundação integrada | [Manual](manuais/RB-022.md) |

<a id="hab-01"></a>
## HAB-01 — Fundação de dados, contratos e observabilidade

Habilitador técnico: preparar persistência, identidade, APIs e diagnóstico que sustentam a jornada.

**Valor/ordenação sugerida:** Preparar/validar dependências da jornada e preservar rastreabilidade.

**Critérios do agrupamento:**
- Contratos e fontes de verdade documentados.
- Dados e APIs isolados por loja e protegidos por autorização.
- Estado, métricas e falhas rastreáveis com testes pertinentes.

**Dúvidas e dependências:** conferir os manuais vinculados; capacidade e acessos externos não são presumidos. Mudança de agrupamento não muda automaticamente escopo/status.

| Tarefa / issue | Entrega esperada | Responsável registrado | Meta | Manual |
| --- | --- | --- | --- | --- |
| [RB-023 / #7](https://github.com/Pedro-Lucas001/boopay/issues/7) | Registrar arquitetura e decisões do desenvolvimento | @ThiagoVenturaV | S1 — Fundação integrada | [Manual](manuais/RB-023.md) |
| [RB-024 / #50](https://github.com/Pedro-Lucas001/boopay/issues/50) | Implementar PostgreSQL transacional e migrations | @cesab-ino | S1 — Fundação integrada | [Manual](manuais/RB-024.md) |
| [RB-025 / #38](https://github.com/Pedro-Lucas001/boopay/issues/38) | Implementar Firestore para estado operacional | @Pedro-Lucas001 | S1 — Fundação integrada | [Manual](manuais/RB-025.md) |
| [RB-026 / #61](https://github.com/Pedro-Lucas001/boopay/issues/61) | Implementar histórico e agregações no BigQuery | @mluisacarvalho | S1 — Fundação integrada | [Manual](manuais/RB-026.md) |
| [RB-027 / #51](https://github.com/Pedro-Lucas001/boopay/issues/51) | Implementar identidade, consentimentos e exclusão | @cesab-ino | S1 — Fundação integrada | [Manual](manuais/RB-027.md) |
| [RB-028 / #39](https://github.com/Pedro-Lucas001/boopay/issues/39) | Implementar APIs de catálogo, perfil e métricas | @AlexLeandro00 (campo nativo pendente) | S1 — Fundação integrada | [Manual](manuais/RB-028.md) |
| [RB-032 / #40](https://github.com/Pedro-Lucas001/boopay/issues/40) | Implementar projeção de perfil e linha do tempo | @Pedro-Lucas001 | S1 — Fundação integrada | [Manual](manuais/RB-032.md) |
| [RB-033 / #62](https://github.com/Pedro-Lucas001/boopay/issues/62) | Definir métricas e consultas do dashboard | @mluisacarvalho | S1 — Fundação integrada | [Manual](manuais/RB-033.md) |
| [RB-034 / #27](https://github.com/Pedro-Lucas001/boopay/issues/27) | Implementar observabilidade e diagnóstico básico | @AlexLeandro00 (campo nativo pendente) | S1 — Fundação integrada | [Manual](manuais/RB-034.md) |

<a id="us-02"></a>
## US-02 — Operar lojas com contexto e isolamento

Como operador autorizado, quero configurar e acessar minhas lojas separadamente para administrar cada operação sem misturar seus dados.

**Valor/ordenação sugerida:** Entregar uma capacidade da jornada confirmada; executar conforme dependências e meta semanal da tarefa.

**Critérios do agrupamento:**
- Duas lojas de teste com configuração e credenciais independentes.
- Navegação e conexão da loja com estados compreensíveis.
- Troca de contexto autorizada e testes negativos de leitura/escrita entre lojas.

**Dúvidas e dependências:** conferir os manuais vinculados; capacidade e acessos externos não são presumidos. Mudança de agrupamento não muda automaticamente escopo/status.

| Tarefa / issue | Entrega esperada | Responsável registrado | Meta | Manual |
| --- | --- | --- | --- | --- |
| [RB-029 / #69](https://github.com/Pedro-Lucas001/boopay/issues/69) | Definir sistema visual e componentes reutilizáveis | A confirmar na issue | S1 — Fundação integrada | [Manual](manuais/RB-029.md) |
| [RB-030 / #79](https://github.com/Pedro-Lucas001/boopay/issues/79) | Implementar estrutura do frontend e navegação | A confirmar na issue | S1 — Fundação integrada | [Manual](manuais/RB-030.md) |
| [RB-031 / #70](https://github.com/Pedro-Lucas001/boopay/issues/70) | Implementar tela de integrações e conexão da loja | A confirmar na issue | S1 — Fundação integrada | [Manual](manuais/RB-031.md) |
| [RB-081 / #19](https://github.com/Pedro-Lucas001/boopay/issues/19) | Implementar operação multiloja e isolamento de dados | @ThiagoVenturaV | S1 — Fundação integrada | [Manual](manuais/RB-081.md) |

<a id="us-03"></a>
## US-03 — Integrar Shopify e VTEX

Como lojista, quero conectar Shopify ou VTEX para usar catálogo, cotação e pedidos autorizados na jornada do Boopay.

**Valor/ordenação sugerida:** Entregar uma capacidade da jornada confirmada; executar conforme dependências e meta semanal da tarefa.

**Critérios do agrupamento:**
- Catálogo/eventos sincronizados no ambiente autorizado de cada plataforma.
- Cotação e pedido usam dados autoritativos e operações idempotentes.
- Versões, permissões e limitações demonstradas; acesso ausente registrado como bloqueio.

**Dúvidas e dependências:** conferir os manuais vinculados; capacidade e acessos externos não são presumidos. Mudança de agrupamento não muda automaticamente escopo/status.

| Tarefa / issue | Entrega esperada | Responsável registrado | Meta | Manual |
| --- | --- | --- | --- | --- |
| [RB-035 / #28](https://github.com/Pedro-Lucas001/boopay/issues/28) | Implementar conector Shopify de catálogo e eventos | @AlexLeandro00 (campo nativo pendente) | S2 — Compra conversacional | [Manual](manuais/RB-035.md) |
| [RB-036 / #8](https://github.com/Pedro-Lucas001/boopay/issues/8) | Implementar cotação e pedido pelo adaptador Shopify | @AlexLeandro00 (campo nativo pendente) | S2 — Compra conversacional | [Manual](manuais/RB-036.md) |
| [RB-037 / #29](https://github.com/Pedro-Lucas001/boopay/issues/29) | Implementar conector VTEX de catálogo e eventos | A confirmar na issue | S2 — Compra conversacional | [Manual](manuais/RB-037.md) |
| [RB-038 / #9](https://github.com/Pedro-Lucas001/boopay/issues/9) | Implementar cotação e pedido pelo adaptador VTEX | @ThiagoVenturaV | S2 — Compra conversacional | [Manual](manuais/RB-038.md) |

<a id="us-04"></a>
## US-04 — Preparar catálogo para descoberta

Como lojista, quero verificar a prontidão e publicar os feeds previstos para tornar meu catálogo utilizável na descoberta por agentes.

**Valor/ordenação sugerida:** Entregar uma capacidade da jornada confirmada; executar conforme dependências e meta semanal da tarefa.

**Critérios do agrupamento:**
- Prontidão identifica dados ausentes e problemas de qualidade.
- GEO/feeds usam dados rastreáveis e contratos versionados.
- Validação distingue disponibilização técnica de aprovação externa.

**Dúvidas e dependências:** conferir os manuais vinculados; capacidade e acessos externos não são presumidos. Mudança de agrupamento não muda automaticamente escopo/status.

| Tarefa / issue | Entrega esperada | Responsável registrado | Meta | Manual |
| --- | --- | --- | --- | --- |
| [RB-039 / #41](https://github.com/Pedro-Lucas001/boopay/issues/41) | Integrar contrato versionado do GEO Readiness Audit | @Pedro-Lucas001 | S2 — Compra conversacional | [Manual](manuais/RB-039.md) |
| [RB-040 / #52](https://github.com/Pedro-Lucas001/boopay/issues/52) | Implementar prontidão e elegibilidade do catálogo | @cesab-ino | S2 — Compra conversacional | [Manual](manuais/RB-040.md) |
| [RB-041 / #71](https://github.com/Pedro-Lucas001/boopay/issues/71) | Implementar painel GEO e prontidão de produtos | A confirmar na issue | S2 — Compra conversacional | [Manual](manuais/RB-041.md) |

<a id="us-05"></a>
## US-05 — Receber recomendações pelo agente

Como comprador, quero conversar com o agente e receber recomendações baseadas no catálogo para escolher um produto adequado.

**Valor/ordenação sugerida:** Entregar uma capacidade da jornada confirmada; executar conforme dependências e meta semanal da tarefa.

**Critérios do agrupamento:**
- GPT/Gemini usam contratos estruturados e catálogo recuperado.
- Recomendação não inventa produto, preço ou condição comercial.
- Interface permite conversar, revisar a seleção e entender falhas.

**Dúvidas e dependências:** conferir os manuais vinculados; capacidade e acessos externos não são presumidos. Mudança de agrupamento não muda automaticamente escopo/status.

| Tarefa / issue | Entrega esperada | Responsável registrado | Meta | Manual |
| --- | --- | --- | --- | --- |
| [RB-042 / #10](https://github.com/Pedro-Lucas001/boopay/issues/10) | Criar camada de IA e contratos de ferramentas | @ThiagoVenturaV | S1 — Fundação integrada | [Manual](manuais/RB-042.md) |
| [RB-043 / #30](https://github.com/Pedro-Lucas001/boopay/issues/30) | Integrar GPT e Gemini e validar equivalência | A confirmar na issue | S2 — Compra conversacional | [Manual](manuais/RB-043.md) |
| [RB-044 / #42](https://github.com/Pedro-Lucas001/boopay/issues/42) | Implementar embeddings e recuperação de catálogo | @Pedro-Lucas001 | S1 — Fundação integrada | [Manual](manuais/RB-044.md) |
| [RB-045 / #11](https://github.com/Pedro-Lucas001/boopay/issues/11) | Implementar recomendação com catálogo e perfil | @ThiagoVenturaV | S2 — Compra conversacional | [Manual](manuais/RB-045.md) |

<a id="us-06"></a>
## US-06 — Confirmar e concluir compra em sandbox

Como comprador, quero revisar e confirmar minha compra para concluir um pagamento de teste e acompanhar o pedido correto.

**Valor/ordenação sugerida:** Entregar uma capacidade da jornada confirmada; executar conforme dependências e meta semanal da tarefa.

**Critérios do agrupamento:**
- Cotação autoritativa e confirmação explícita antes da operação.
- Pagamento de teste, pedido e reconciliação rastreáveis.
- Retentativa/callback repetido não duplica cobrança ou pedido.
- Carteira/interface de teste identifica claramente o ambiente sandbox.

**Dúvidas e dependências:** conferir os manuais vinculados; capacidade e acessos externos não são presumidos. Mudança de agrupamento não muda automaticamente escopo/status.

| Tarefa / issue | Entrega esperada | Responsável registrado | Meta | Manual |
| --- | --- | --- | --- | --- |
| [RB-046 / #31](https://github.com/Pedro-Lucas001/boopay/issues/31) | Implementar Checkout Core e máquina de estados | A confirmar na issue | S1 — Fundação integrada | [Manual](manuais/RB-046.md) |
| [RB-047 / #12](https://github.com/Pedro-Lucas001/boopay/issues/12) | Implementar cotação autoritativa WooCommerce | @ThiagoVenturaV | S2 — Compra conversacional | [Manual](manuais/RB-047.md) |
| [RB-048 / #32](https://github.com/Pedro-Lucas001/boopay/issues/32) | Implementar criação e recuperação de pedido WooCommerce | A confirmar na issue | S2 — Compra conversacional | [Manual](manuais/RB-048.md) |
| [RB-049 / #80](https://github.com/Pedro-Lucas001/boopay/issues/80) | Implementar interface conversacional e revisão da compra | A confirmar na issue | S2 — Compra conversacional | [Manual](manuais/RB-049.md) |
| [RB-050 / #33](https://github.com/Pedro-Lucas001/boopay/issues/33) | Implementar Stripe em sandbox e callbacks | A confirmar na issue | S2 — Compra conversacional | [Manual](manuais/RB-050.md) |
| [RB-051 / #81](https://github.com/Pedro-Lucas001/boopay/issues/81) | Implementar Google Pay de teste no checkout | A confirmar na issue | S2 — Compra conversacional | [Manual](manuais/RB-051.md) |
| [RB-052 / #53](https://github.com/Pedro-Lucas001/boopay/issues/53) | Implementar conciliação, cancelamento e reembolso | @cesab-ino | S2 — Compra conversacional | [Manual](manuais/RB-052.md) |

<a id="us-07"></a>
## US-07 — Usar contratos de comércio com agentes

Como integrador, quero contratos ACP/UCP verificáveis para conectar a jornada do Boopay a clientes de agentes compatíveis.

**Valor/ordenação sugerida:** Entregar uma capacidade da jornada confirmada; executar conforme dependências e meta semanal da tarefa.

**Critérios do agrupamento:**
- Contratos e versões aplicadas documentados.
- Fluxos locais/sandbox e falhas pertinentes reproduzíveis.
- Adaptador local não é apresentado como publicação oficial no ChatGPT/Gemini.

**Dúvidas e dependências:** conferir os manuais vinculados; capacidade e acessos externos não são presumidos. Mudança de agrupamento não muda automaticamente escopo/status.

| Tarefa / issue | Entrega esperada | Responsável registrado | Meta | Manual |
| --- | --- | --- | --- | --- |
| [RB-053 / #13](https://github.com/Pedro-Lucas001/boopay/issues/13) | Implementar adaptador ACP sobre Checkout Core | @ThiagoVenturaV | S2 — Compra conversacional | [Manual](manuais/RB-053.md) |
| [RB-054 / #34](https://github.com/Pedro-Lucas001/boopay/issues/34) | Implementar adaptador UCP sobre Checkout Core | A confirmar na issue | S2 — Compra conversacional | [Manual](manuais/RB-054.md) |
| [RB-055 / #43](https://github.com/Pedro-Lucas001/boopay/issues/43) | Implementar feeds e descoberta do catálogo agêntico | @Pedro-Lucas001 | S2 — Compra conversacional | [Manual](manuais/RB-055.md) |
| [RB-056 / #72](https://github.com/Pedro-Lucas001/boopay/issues/72) | Identificar superfícies e evidências reais ou simuladas | A confirmar na issue | S2 — Compra conversacional | [Manual](manuais/RB-056.md) |

<a id="us-08"></a>
## US-08 — Consultar perfil e atribuir resultados à jornada

Como lojista, quero consultar perfis e comparar os contatos que levaram à compra para compreender a jornada e os resultados da minha loja.

**Valor/ordenação sugerida:** Entregar uma capacidade da jornada confirmada; executar conforme dependências e meta semanal da tarefa.

**Critérios do agrupamento:**
- Perfil 360/CDP com identidade determinística autorizada, linhagem e exclusão.
- Dashboards de receita, carrinho, produtos e qualidade/custo de IA com dados rastreáveis.
- Atribuição primeiro toque, último toque e linear sem duplicar receita.
- Consentimento e isolamento entre lojas validados; sem WhatsApp.

**Dúvidas e dependências:** conferir os manuais vinculados; capacidade e acessos externos não são presumidos. Mudança de agrupamento não muda automaticamente escopo/status.

| Tarefa / issue | Entrega esperada | Responsável registrado | Meta | Manual |
| --- | --- | --- | --- | --- |
| [RB-057 / #63](https://github.com/Pedro-Lucas001/boopay/issues/63) | Modelar carrinho, abandono e jornada analítica | @mluisacarvalho | S1 — Fundação integrada | [Manual](manuais/RB-057.md) |
| [RB-058 / #44](https://github.com/Pedro-Lucas001/boopay/issues/44) | Implementar funil e atribuição da jornada | @Pedro-Lucas001 | S2 — Compra conversacional | [Manual](manuais/RB-058.md) |
| [RB-059 / #54](https://github.com/Pedro-Lucas001/boopay/issues/54) | Completar os dados do perfil 360 do MVP | @cesab-ino | S3 — Produto completo e homologação | [Manual](manuais/RB-059.md) |
| [RB-060 / #73](https://github.com/Pedro-Lucas001/boopay/issues/73) | Implementar telas do perfil 360 e exclusão | A confirmar na issue | S3 — Produto completo e homologação | [Manual](manuais/RB-060.md) |
| [RB-061 / #82](https://github.com/Pedro-Lucas001/boopay/issues/82) | Implementar visão executiva e receita do dashboard | A confirmar na issue | S3 — Produto completo e homologação | [Manual](manuais/RB-061.md) |
| [RB-062 / #74](https://github.com/Pedro-Lucas001/boopay/issues/74) | Implementar dashboard de carrinhos e abandono | A confirmar na issue | S3 — Produto completo e homologação | [Manual](manuais/RB-062.md) |
| [RB-063 / #83](https://github.com/Pedro-Lucas001/boopay/issues/83) | Implementar produtos, filtros e exportação | A confirmar na issue | S3 — Produto completo e homologação | [Manual](manuais/RB-063.md) |
| [RB-064 / #75](https://github.com/Pedro-Lucas001/boopay/issues/75) | Completar dashboard GEO, protocolos e atribuição | A confirmar na issue | S3 — Produto completo e homologação | [Manual](manuais/RB-064.md) |
| [RB-065 / #84](https://github.com/Pedro-Lucas001/boopay/issues/84) | Exibir qualidade, latência, falhas e custo de IA | A confirmar na issue | S3 — Produto completo e homologação | [Manual](manuais/RB-065.md) |
| [RB-083 / #57](https://github.com/Pedro-Lucas001/boopay/issues/57) | Implementar CDP completo e identidade avançada | @cesab-ino | S3 — Produto completo e homologação | [Manual](manuais/RB-083.md) |
| [RB-084 / #67](https://github.com/Pedro-Lucas001/boopay/issues/67) | Implementar rastreamento avançado e atribuição multitoque | @mluisacarvalho | S3 — Produto completo e homologação | [Manual](manuais/RB-084.md) |

<a id="hab-02"></a>
## HAB-02 — Qualidade integrada e recuperação

Habilitador de qualidade: verificar a jornada completa, falhas, segurança e experiência antes da liberação.

**Valor/ordenação sugerida:** Preparar/validar dependências da jornada e preservar rastreabilidade.

**Critérios do agrupamento:**
- E2E integrado com resultados esperados e observados.
- Falhas, concorrência, isolamento e idempotência cobertos.
- Problemas críticos resolvidos e verificações de UX/acessibilidade registradas.

**Dúvidas e dependências:** conferir os manuais vinculados; capacidade e acessos externos não são presumidos. Mudança de agrupamento não muda automaticamente escopo/status.

| Tarefa / issue | Entrega esperada | Responsável registrado | Meta | Manual |
| --- | --- | --- | --- | --- |
| [RB-066 / #14](https://github.com/Pedro-Lucas001/boopay/issues/14) | Automatizar jornada principal do MVP em sandbox | @ThiagoVenturaV | S3 — Produto completo e homologação | [Manual](manuais/RB-066.md) |
| [RB-067 / #35](https://github.com/Pedro-Lucas001/boopay/issues/35) | Testar falhas, idempotência e recuperação | @AlexLeandro00 (campo nativo pendente) | S3 — Produto completo e homologação | [Manual](manuais/RB-067.md) |
| [RB-068 / #15](https://github.com/Pedro-Lucas001/boopay/issues/15) | Verificar autorização, isolamento e proteção de dados | @ThiagoVenturaV | S3 — Produto completo e homologação | [Manual](manuais/RB-068.md) |
| [RB-069 / #76](https://github.com/Pedro-Lucas001/boopay/issues/76) | Revisar usabilidade, responsividade e acessibilidade | A confirmar na issue | S3 — Produto completo e homologação | [Manual](manuais/RB-069.md) |

<a id="hab-03"></a>
## HAB-03 — Documentação, apresentação e entrega

Habilitador de entrega: consolidar documentos, evidências, custos, ensaios e submissão verificável.

**Valor/ordenação sugerida:** Preparar/validar dependências da jornada e preservar rastreabilidade.

**Critérios do agrupamento:**
- Pacote e documentação reproduzidos em ambiente novo até 03/11.
- Slides, dois ensaios e plano B registrados quando realizados.
- Canal/horário/formato confirmados por fonte oficial em #17.
- Comprovante real e contribuições registrados após a entrega.

**Dúvidas e dependências:** conferir os manuais vinculados; capacidade e acessos externos não são presumidos. Mudança de agrupamento não muda automaticamente escopo/status.

| Tarefa / issue | Entrega esperada | Responsável registrado | Meta | Manual |
| --- | --- | --- | --- | --- |
| [RB-070 / #45](https://github.com/Pedro-Lucas001/boopay/issues/45) | Consolidar README e guias das frentes | @Pedro-Lucas001 | S3 — Produto completo e homologação | [Manual](manuais/RB-070.md) |
| [RB-071 / #55](https://github.com/Pedro-Lucas001/boopay/issues/55) | Organizar registro individual e consolidado de Prompt Ops | @cesab-ino | S3 — Produto completo e homologação | [Manual](manuais/RB-071.md) |
| [RB-072 / #64](https://github.com/Pedro-Lucas001/boopay/issues/64) | Produzir documento de dois prompts que falharam | @mluisacarvalho | S3 — Produto completo e homologação | [Manual](manuais/RB-072.md) |
| [RB-073 / #65](https://github.com/Pedro-Lucas001/boopay/issues/65) | Calcular custos e viabilidade econômica | @mluisacarvalho | S3 — Produto completo e homologação | [Manual](manuais/RB-073.md) |
| [RB-074 / #85](https://github.com/Pedro-Lucas001/boopay/issues/85) | Criar slides e roteiro de apresentação do MVP | A confirmar na issue | S3 — Produto completo e homologação | [Manual](manuais/RB-074.md) |
| [RB-075 / #16](https://github.com/Pedro-Lucas001/boopay/issues/16) | Ensaiar apresentação e preparar plano B | @ThiagoVenturaV | S3 — Produto completo e homologação | [Manual](manuais/RB-075.md) |
| [RB-076 / #56](https://github.com/Pedro-Lucas001/boopay/issues/56) | Congelar versão e organizar pacote do MVP | @cesab-ino | S3 — Produto completo e homologação | [Manual](manuais/RB-076.md) |
| [RB-077 / #17](https://github.com/Pedro-Lucas001/boopay/issues/17) | Registrar requisitos de submissão da entrega | @ThiagoVenturaV | S1 — Fundação integrada | [Manual](manuais/RB-077.md) |
| [RB-078 / #46](https://github.com/Pedro-Lucas001/boopay/issues/46) | Reproduzir pacote em ambiente novo | @Pedro-Lucas001 | S3 — Produto completo e homologação | [Manual](manuais/RB-078.md) |
| [RB-079 / #18](https://github.com/Pedro-Lucas001/boopay/issues/18) | Submeter a entrega e guardar o comprovante | @ThiagoVenturaV | Entrega final | [Manual](manuais/RB-079.md) |
| [RB-080 / #66](https://github.com/Pedro-Lucas001/boopay/issues/66) | Registrar contribuições e retrospectiva | @mluisacarvalho | Entrega final | [Manual](manuais/RB-080.md) |

<a id="us-09"></a>
## US-09 — Planos e cobrança SaaS — futuro

Como responsável pelo produto, quero especificar planos e cobrança SaaS para avaliar a futura comercialização da plataforma.

**Valor/ordenação sugerida:** Evolução futura, fora da data de entrega.

**Critérios do agrupamento:**
- Modelo comercial e limites propostos com hipóteses identificadas.
- Dependências e critérios de entrada documentados.
- Permanece fora do compromisso de 04/11.

**Dúvidas e dependências:** conferir os manuais vinculados; capacidade e acessos externos não são presumidos. Mudança de agrupamento não muda automaticamente escopo/status.

| Tarefa / issue | Entrega esperada | Responsável registrado | Meta | Manual |
| --- | --- | --- | --- | --- |
| [RB-082 / #20](https://github.com/Pedro-Lucas001/boopay/issues/20) | Especificar planos e cobrança SaaS futura | @ThiagoVenturaV | Futuro — fora da entrega de 04/11 | [Manual](manuais/RB-082.md) |

<a id="us-10"></a>
## US-10 — Publicação oficial em superfícies de agentes — futuro

Como responsável pelo produto, quero mapear homologação/publicação oficial para planejar a disponibilização autorizada em superfícies de agentes.

**Valor/ordenação sugerida:** Evolução futura, fora da data de entrega.

**Critérios do agrupamento:**
- Requisitos de cada provedor registrados com fonte e data.
- Distinguir testes, solicitação e aprovação efetiva.
- Permanece fora do compromisso de 04/11.

**Dúvidas e dependências:** conferir os manuais vinculados; capacidade e acessos externos não são presumidos. Mudança de agrupamento não muda automaticamente escopo/status.

| Tarefa / issue | Entrega esperada | Responsável registrado | Meta | Manual |
| --- | --- | --- | --- | --- |
| [RB-085 / #21](https://github.com/Pedro-Lucas001/boopay/issues/21) | Mapear homologação e publicação em superfícies oficiais | @ThiagoVenturaV | Futuro — fora da entrega de 04/11 | [Manual](manuais/RB-085.md) |
