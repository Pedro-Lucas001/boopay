# Organização Scrum e sincronização do planejamento — 14/10/2026

## Identificação e escopo
- Autor: Thiago Ventura Velez De Andrade, com apoio de ChatGPT/Codex conforme [registro de IA](../uso-ia.md).
- Branch: `docs/scrum-planejamento-2026-10-14`, criada a partir da main `3f22847`.
- Revisão solicitada: Pedro Lucas; aprovação humana e merge pendentes.
- Referências de escopo: issues [#19](https://github.com/Pedro-Lucas001/boopay/issues/19), [#57](https://github.com/Pedro-Lucas001/boopay/issues/57) e [#67](https://github.com/Pedro-Lucas001/boopay/issues/67). Esta entrega é documental e usa `Refs`, sem encerrar essas implementações.

## O que mudou e por quê
- Visão/Product Goal separa propósito, escopo confirmado, hipótese de valor e validação pendente.
- Acordo reúne oito integrantes e responsabilidades confirmadas, preservando disponibilidade, papel formal de PO e acessos ainda pendentes.
- DoD reúne o padrão comum; critérios particulares continuam nas issues/RFCs.
- Dez histórias e três habilitadores ligam as 85 tarefas existentes a benefícios/necessidades e trabalho de suporte. Não foram criadas cópias de issues nem vínculos nativos de sub-issue.
- Três sprints e uma janela de entrega documentam objetivo, dependências, demonstração, capacidade a confirmar e modelos curtos de Review/Retrospectiva.
- As 85 RFCs recebem sprint vigente e vínculo de história/habilitador; as cinco tarefas de Alex refletem a responsabilidade confirmada, sem alegar atribuição nativa.
- RB-081/RB-083/RB-084 passam de expansão futura para implementação na entrega, com critérios copiados das issues verificadas ao vivo em 14/10. A abordagem técnica continua sujeita à revisão.
- README, CONTRIBUTING, índice de RFCs e modelo de PR apontam para o fluxo atualizado. O manifesto JSON é registro de planejamento, sem executar importações.

## Verificações realizadas pelo autor
| Verificação | Resultado observado |
| --- | --- |
| `npm run check:docs` | Links relativos dos 103 documentos conferidos; nenhuma ausência encontrada. |
| `git diff --check` | Nenhum erro de whitespace encontrado. |
| Integridade do manifesto | 85 IDs e números de issue únicos; 10 histórias e 3 habilitadores; cada tarefa ligada a um grupo existente. |
| Distribuição por meta | S1 40, S2 20, S3 21, entrega 2; futuras somente #20/#21. |
| Correspondência das RFCs | 85 vínculos de sprint/grupo; 82 listas de aceite iguais à main de origem; 3 listas iguais às issues #19/#57/#67 consultadas pelo conector. |
| Responsabilidade de Alex | #39/#27/#28/#8/#35 apontam para Alex no mapa/RFC; campo nativo continua explicitamente pendente. |
| Âncoras do backlog | 13 IDs de grupo únicos e correspondentes aos links das RFCs/sprints. |

Ambiente local: Windows/PowerShell, Node 24.18.0; verificação documental sem dependências npm instaladas. O ambiente de execução de código do time/CI segue o CONTRIBUTING. Não foram feitos testes funcionais novos, porque o PR altera documentação e templates, sem implementação de produto.

## Como reproduzir a conferência
1. Abrir a branch deste PR e executar `npm run check:docs` e `git diff --check`.
2. Ler o [manifesto](../planejamento/backlog.json), conferir 85 tarefas únicas e contagens 40/20/21/2/2. Comparar cada grupo com [docs/backlog.md](../backlog.md) e seu vínculo na RFC.
3. Comparar o aceite das RFCs RB-081/RB-083/RB-084 com as três issues; conferir a decisão de 14/10 e a preservação de execução/testes como pendentes.
4. Abrir [S1](../sprints/sprint-01.md), [S2](../sprints/sprint-02.md), [S3](../sprints/sprint-03.md) e [entrega](../sprints/entrega-04-11.md); conferir datas, dependências e ausência de confirmação fictícia de capacidade/Review/ensaio/envio.
5. Verificar responsabilidades no [acordo](../acordo-trabalho.md), estado nativo do Alex nas issues e o fluxo de revisão da [DoD](../definition-of-done.md).

## Limites e próximas decisões humanas
Aceite coletivo dos acordos, disponibilidade real, Product Owner formal, usuário da Letícia, atribuição nativa do Alex, proteção de branches e requisitos oficiais de submissão continuam a confirmar. Não houve alteração de visibilidade/permissões, merge de PRs de produto ou marcação de tarefas como Done. O planejamento exige atualização quando o time confirmar ou mudar esses fatos.

## Revisão e validação final
Revisor, feedback, ajustes e aprovação: preencher após a revisão real do PR. O autor fez conferência documental, não aprovação independente do próprio trabalho.
