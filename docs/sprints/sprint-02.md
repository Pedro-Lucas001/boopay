# S2 — Compra conversacional — 21–27/10/2026

## Objetivo e resultado verificável
Demonstrar a jornada conversa → recomendação → revisão → confirmação → pagamento de teste → pedido → atribuição básica, preservando o contexto da loja.

Prazo: **2026-10-27**, America/Fortaleza. [Quadro filtrado](https://github.com/users/Pedro-Lucas001/projects/2/views/9) · [Meta no repositório](https://github.com/Pedro-Lucas001/boopay/milestone/2) · [DoD](../definition-of-done.md).

## Sequência, dependências e demonstração
Depende da base de S1. Demonstrar em 27/10 o fluxo integrado e a reconciliação de pedido; fonte comercial é autoritativa e a confirmação é explícita. Shopify/VTEX e provedores exigem acesso autorizado de teste; registrar falta de ambiente como bloqueio.

Aplicar isolamento multiloja na jornada e produzir ingestão/coleta/fixtures para CDP e multitoque da S3. Não afirmar publicação oficial no ChatGPT/Gemini a partir de contrato ou adaptador local.

## Capacidade e plano de execução
Disponibilidade por pessoa: **não informada**; registrar dias/horas, ausências e capacidade de revisão na planning. O conjunto abaixo é a alocação publicada, sujeita a refinamento e conferência dos Developers. Não inventar velocidade ou estimativas. Uma implementação ativa por pessoa; conferir responsáveis, dependências e ambiente antes de Ready. Se a capacidade não cobrir a meta, registrar o risco e negociar ordem/escopo com o responsável pelo produto antes de prometer conclusão.

## Itens vinculados (20)
| Tarefa / issue | História ou habilitador | Responsável registrado | RFC |
| --- | --- | --- | --- |
| [RB-035 / #28](https://github.com/Pedro-Lucas001/boopay/issues/28) | [US-03](../backlog.md#us-03) | @AlexLeandro00 (campo nativo pendente) | [RFC](../rfcs/RB-035.md) |
| [RB-036 / #8](https://github.com/Pedro-Lucas001/boopay/issues/8) | [US-03](../backlog.md#us-03) | @AlexLeandro00 (campo nativo pendente) | [RFC](../rfcs/RB-036.md) |
| [RB-037 / #29](https://github.com/Pedro-Lucas001/boopay/issues/29) | [US-03](../backlog.md#us-03) | A confirmar na issue | [RFC](../rfcs/RB-037.md) |
| [RB-038 / #9](https://github.com/Pedro-Lucas001/boopay/issues/9) | [US-03](../backlog.md#us-03) | @ThiagoVenturaV | [RFC](../rfcs/RB-038.md) |
| [RB-039 / #41](https://github.com/Pedro-Lucas001/boopay/issues/41) | [US-04](../backlog.md#us-04) | @Pedro-Lucas001 | [RFC](../rfcs/RB-039.md) |
| [RB-040 / #52](https://github.com/Pedro-Lucas001/boopay/issues/52) | [US-04](../backlog.md#us-04) | @cesab-ino | [RFC](../rfcs/RB-040.md) |
| [RB-041 / #71](https://github.com/Pedro-Lucas001/boopay/issues/71) | [US-04](../backlog.md#us-04) | A confirmar na issue | [RFC](../rfcs/RB-041.md) |
| [RB-043 / #30](https://github.com/Pedro-Lucas001/boopay/issues/30) | [US-05](../backlog.md#us-05) | A confirmar na issue | [RFC](../rfcs/RB-043.md) |
| [RB-045 / #11](https://github.com/Pedro-Lucas001/boopay/issues/11) | [US-05](../backlog.md#us-05) | @ThiagoVenturaV | [RFC](../rfcs/RB-045.md) |
| [RB-047 / #12](https://github.com/Pedro-Lucas001/boopay/issues/12) | [US-06](../backlog.md#us-06) | @ThiagoVenturaV | [RFC](../rfcs/RB-047.md) |
| [RB-048 / #32](https://github.com/Pedro-Lucas001/boopay/issues/32) | [US-06](../backlog.md#us-06) | A confirmar na issue | [RFC](../rfcs/RB-048.md) |
| [RB-049 / #80](https://github.com/Pedro-Lucas001/boopay/issues/80) | [US-06](../backlog.md#us-06) | A confirmar na issue | [RFC](../rfcs/RB-049.md) |
| [RB-050 / #33](https://github.com/Pedro-Lucas001/boopay/issues/33) | [US-06](../backlog.md#us-06) | A confirmar na issue | [RFC](../rfcs/RB-050.md) |
| [RB-051 / #81](https://github.com/Pedro-Lucas001/boopay/issues/81) | [US-06](../backlog.md#us-06) | A confirmar na issue | [RFC](../rfcs/RB-051.md) |
| [RB-052 / #53](https://github.com/Pedro-Lucas001/boopay/issues/53) | [US-06](../backlog.md#us-06) | @cesab-ino | [RFC](../rfcs/RB-052.md) |
| [RB-053 / #13](https://github.com/Pedro-Lucas001/boopay/issues/13) | [US-07](../backlog.md#us-07) | @ThiagoVenturaV | [RFC](../rfcs/RB-053.md) |
| [RB-054 / #34](https://github.com/Pedro-Lucas001/boopay/issues/34) | [US-07](../backlog.md#us-07) | A confirmar na issue | [RFC](../rfcs/RB-054.md) |
| [RB-055 / #43](https://github.com/Pedro-Lucas001/boopay/issues/43) | [US-07](../backlog.md#us-07) | @Pedro-Lucas001 | [RFC](../rfcs/RB-055.md) |
| [RB-056 / #72](https://github.com/Pedro-Lucas001/boopay/issues/72) | [US-07](../backlog.md#us-07) | A confirmar na issue | [RFC](../rfcs/RB-056.md) |
| [RB-058 / #44](https://github.com/Pedro-Lucas001/boopay/issues/44) | [US-08](../backlog.md#us-08) | @Pedro-Lucas001 | [RFC](../rfcs/RB-058.md) |

## Registro da planning e do acompanhamento
- Data/participantes/ciência do plano: **pendentes de registro do time**.
- Disponibilidade e itens efetivamente selecionados pelos executores: **pendentes de confirmação**.
- Impedimentos: registrar na issue afetada com impacto, tentativa e ajuda necessária; revisar diariamente quando houver trabalho ativo.
- Decisão que alterar a meta: registrar aqui com data, motivo e link da issue/RFC; atualizar Project e [manifesto](../planejamento/backlog.json).

## Review e retrospectiva
Review: **não registrada neste documento**. Preencher com [modelo curto](MODELO-REVIEW.md), versão, demonstração e feedback real.

Retrospectiva: **não registrada neste documento**. Usar [modelo curto](MODELO-RETROSPECTIVA.md), escolher uma melhoria verificável e conferir seu resultado na semana seguinte.

Mover para Done exige a DoD e o aceite específico. Este arquivo registra planejamento, não comprovação de entrega.
