# S1 — Fundação integrada — 14–20/10/2026

## Objetivo e resultado verificável
Preparar a base integrada para uma compra conversacional, com duas lojas isoladas, catálogo consultável e contratos de checkout/IA disponíveis.

Prazo: **2026-10-20**, America/Fortaleza. [Quadro filtrado](https://github.com/users/Pedro-Lucas001/projects/2/views/8) · [Meta no repositório](https://github.com/Pedro-Lucas001/boopay/milestone/1) · [DoD](../definition-of-done.md).

## Sequência, dependências e demonstração
São 40 tarefas: 22 cards do plugin que estavam In review na conferência de 14/10 e 18 de evolução. Isso não significa 40 implementações novas. Conferir/integrar a cadeia de PRs #88 → #89 → #92 → #93 → #94 após revisão, sem refazer a entrega informada.

Ordem: arquitetura/contratos e multiloja → PostgreSQL/identidade/estado → APIs/observabilidade/frontend → Checkout Core/IA/recuperação. Definir já contratos de CDP (#57) e atribuição multitoque (#67). Registrar fonte/canal/horário/formato de envio em #17.

Demonstração em 20/10: duas lojas isoladas, consultas autorizadas, diagnóstico e interfaces que destravam S2. Testes negativos de acesso cruzado são obrigatórios no aceite multiloja.

## Capacidade e plano de execução
Disponibilidade por pessoa: **não informada**; registrar dias/horas, ausências e capacidade de revisão na planning. O conjunto abaixo é a alocação publicada, sujeita a refinamento e conferência dos Developers. Não inventar velocidade ou estimativas. Uma implementação ativa por pessoa; conferir responsáveis, dependências e ambiente antes de Ready. Se a capacidade não cobrir a meta, registrar o risco e negociar ordem/escopo com o responsável pelo produto antes de prometer conclusão.

## Itens vinculados (40)
| Tarefa / issue | História ou habilitador | Responsável registrado | Manual |
| --- | --- | --- | --- |
| [RB-001 / #1](https://github.com/Pedro-Lucas001/boopay/issues/1) | [US-01](../backlog.md#us-01) | @ThiagoVenturaV | [Manual](../manuais/RB-001.md) |
| [RB-002 / #2](https://github.com/Pedro-Lucas001/boopay/issues/2) | [US-01](../backlog.md#us-01) | @ThiagoVenturaV | [Manual](../manuais/RB-002.md) |
| [RB-003 / #58](https://github.com/Pedro-Lucas001/boopay/issues/58) | [US-01](../backlog.md#us-01) | @mluisacarvalho | [Manual](../manuais/RB-003.md) |
| [RB-004 / #22](https://github.com/Pedro-Lucas001/boopay/issues/22) | [US-01](../backlog.md#us-01) | A confirmar na issue | [Manual](../manuais/RB-004.md) |
| [RB-005 / #36](https://github.com/Pedro-Lucas001/boopay/issues/36) | [US-01](../backlog.md#us-01) | @Pedro-Lucas001 | [Manual](../manuais/RB-005.md) |
| [RB-006 / #47](https://github.com/Pedro-Lucas001/boopay/issues/47) | [US-01](../backlog.md#us-01) | @cesab-ino | [Manual](../manuais/RB-006.md) |
| [RB-007 / #59](https://github.com/Pedro-Lucas001/boopay/issues/59) | [US-01](../backlog.md#us-01) | @mluisacarvalho | [Manual](../manuais/RB-007.md) |
| [RB-008 / #23](https://github.com/Pedro-Lucas001/boopay/issues/23) | [US-01](../backlog.md#us-01) | A confirmar na issue | [Manual](../manuais/RB-008.md) |
| [RB-009 / #68](https://github.com/Pedro-Lucas001/boopay/issues/68) | [US-01](../backlog.md#us-01) | A confirmar na issue | [Manual](../manuais/RB-009.md) |
| [RB-010 / #77](https://github.com/Pedro-Lucas001/boopay/issues/77) | [US-01](../backlog.md#us-01) | A confirmar na issue | [Manual](../manuais/RB-010.md) |
| [RB-011 / #3](https://github.com/Pedro-Lucas001/boopay/issues/3) | [US-01](../backlog.md#us-01) | @ThiagoVenturaV | [Manual](../manuais/RB-011.md) |
| [RB-012 / #24](https://github.com/Pedro-Lucas001/boopay/issues/24) | [US-01](../backlog.md#us-01) | A confirmar na issue | [Manual](../manuais/RB-012.md) |
| [RB-013 / #4](https://github.com/Pedro-Lucas001/boopay/issues/4) | [US-01](../backlog.md#us-01) | @ThiagoVenturaV | [Manual](../manuais/RB-013.md) |
| [RB-014 / #25](https://github.com/Pedro-Lucas001/boopay/issues/25) | [US-01](../backlog.md#us-01) | A confirmar na issue | [Manual](../manuais/RB-014.md) |
| [RB-015 / #37](https://github.com/Pedro-Lucas001/boopay/issues/37) | [US-01](../backlog.md#us-01) | @Pedro-Lucas001 | [Manual](../manuais/RB-015.md) |
| [RB-016 / #48](https://github.com/Pedro-Lucas001/boopay/issues/48) | [US-01](../backlog.md#us-01) | @cesab-ino | [Manual](../manuais/RB-016.md) |
| [RB-017 / #26](https://github.com/Pedro-Lucas001/boopay/issues/26) | [US-01](../backlog.md#us-01) | A confirmar na issue | [Manual](../manuais/RB-017.md) |
| [RB-018 / #78](https://github.com/Pedro-Lucas001/boopay/issues/78) | [US-01](../backlog.md#us-01) | A confirmar na issue | [Manual](../manuais/RB-018.md) |
| [RB-019 / #60](https://github.com/Pedro-Lucas001/boopay/issues/60) | [US-01](../backlog.md#us-01) | @mluisacarvalho | [Manual](../manuais/RB-019.md) |
| [RB-020 / #5](https://github.com/Pedro-Lucas001/boopay/issues/5) | [US-01](../backlog.md#us-01) | @ThiagoVenturaV | [Manual](../manuais/RB-020.md) |
| [RB-021 / #49](https://github.com/Pedro-Lucas001/boopay/issues/49) | [US-01](../backlog.md#us-01) | @cesab-ino | [Manual](../manuais/RB-021.md) |
| [RB-022 / #6](https://github.com/Pedro-Lucas001/boopay/issues/6) | [US-01](../backlog.md#us-01) | @ThiagoVenturaV | [Manual](../manuais/RB-022.md) |
| [RB-023 / #7](https://github.com/Pedro-Lucas001/boopay/issues/7) | [HAB-01](../backlog.md#hab-01) | @ThiagoVenturaV | [Manual](../manuais/RB-023.md) |
| [RB-024 / #50](https://github.com/Pedro-Lucas001/boopay/issues/50) | [HAB-01](../backlog.md#hab-01) | @cesab-ino | [Manual](../manuais/RB-024.md) |
| [RB-025 / #38](https://github.com/Pedro-Lucas001/boopay/issues/38) | [HAB-01](../backlog.md#hab-01) | @Pedro-Lucas001 | [Manual](../manuais/RB-025.md) |
| [RB-026 / #61](https://github.com/Pedro-Lucas001/boopay/issues/61) | [HAB-01](../backlog.md#hab-01) | @mluisacarvalho | [Manual](../manuais/RB-026.md) |
| [RB-027 / #51](https://github.com/Pedro-Lucas001/boopay/issues/51) | [HAB-01](../backlog.md#hab-01) | @cesab-ino | [Manual](../manuais/RB-027.md) |
| [RB-028 / #39](https://github.com/Pedro-Lucas001/boopay/issues/39) | [HAB-01](../backlog.md#hab-01) | @AlexLeandro00 (campo nativo pendente) | [Manual](../manuais/RB-028.md) |
| [RB-029 / #69](https://github.com/Pedro-Lucas001/boopay/issues/69) | [US-02](../backlog.md#us-02) | A confirmar na issue | [Manual](../manuais/RB-029.md) |
| [RB-030 / #79](https://github.com/Pedro-Lucas001/boopay/issues/79) | [US-02](../backlog.md#us-02) | A confirmar na issue | [Manual](../manuais/RB-030.md) |
| [RB-031 / #70](https://github.com/Pedro-Lucas001/boopay/issues/70) | [US-02](../backlog.md#us-02) | A confirmar na issue | [Manual](../manuais/RB-031.md) |
| [RB-032 / #40](https://github.com/Pedro-Lucas001/boopay/issues/40) | [HAB-01](../backlog.md#hab-01) | @Pedro-Lucas001 | [Manual](../manuais/RB-032.md) |
| [RB-033 / #62](https://github.com/Pedro-Lucas001/boopay/issues/62) | [HAB-01](../backlog.md#hab-01) | @mluisacarvalho | [Manual](../manuais/RB-033.md) |
| [RB-034 / #27](https://github.com/Pedro-Lucas001/boopay/issues/27) | [HAB-01](../backlog.md#hab-01) | @AlexLeandro00 (campo nativo pendente) | [Manual](../manuais/RB-034.md) |
| [RB-042 / #10](https://github.com/Pedro-Lucas001/boopay/issues/10) | [US-05](../backlog.md#us-05) | @ThiagoVenturaV | [Manual](../manuais/RB-042.md) |
| [RB-044 / #42](https://github.com/Pedro-Lucas001/boopay/issues/42) | [US-05](../backlog.md#us-05) | @Pedro-Lucas001 | [Manual](../manuais/RB-044.md) |
| [RB-046 / #31](https://github.com/Pedro-Lucas001/boopay/issues/31) | [US-06](../backlog.md#us-06) | A confirmar na issue | [Manual](../manuais/RB-046.md) |
| [RB-057 / #63](https://github.com/Pedro-Lucas001/boopay/issues/63) | [US-08](../backlog.md#us-08) | @mluisacarvalho | [Manual](../manuais/RB-057.md) |
| [RB-077 / #17](https://github.com/Pedro-Lucas001/boopay/issues/17) | [HAB-03](../backlog.md#hab-03) | @ThiagoVenturaV | [Manual](../manuais/RB-077.md) |
| [RB-081 / #19](https://github.com/Pedro-Lucas001/boopay/issues/19) | [US-02](../backlog.md#us-02) | @ThiagoVenturaV | [Manual](../manuais/RB-081.md) |

## Registro da planning e do acompanhamento
- Data/participantes/ciência do plano: **pendentes de registro do time**.
- Disponibilidade e itens efetivamente selecionados pelos executores: **pendentes de confirmação**.
- Impedimentos: registrar na issue afetada com impacto, tentativa e ajuda necessária; revisar diariamente quando houver trabalho ativo.
- Decisão que alterar a meta: registrar aqui com data, motivo e link da issue/manual; atualizar Project e [manifesto](../planejamento/backlog.json).

## Review e retrospectiva
Review: **não registrada neste documento**. Preencher com [modelo curto](MODELO-REVIEW.md), versão, demonstração e feedback real.

Retrospectiva: **não registrada neste documento**. Usar [modelo curto](MODELO-RETROSPECTIVA.md), escolher uma melhoria verificável e conferir seu resultado na semana seguinte.

Mover para Done exige a DoD e o aceite específico. Este arquivo registra planejamento, não comprovação de entrega.
