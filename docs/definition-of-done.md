# Definition of Done — Boopay

Padrão comum de qualidade proposto para revisão do time em 14/10/2026. O checklist do PR registra verificações do autor; a aprovação é feita por outra pessoa.

Uma entrega está Done quando:
1. Os critérios de aceite da issue foram conferidos, atendidos e ligados a evidências. Critério não executado permanece pendente.
2. O trabalho foi revisado por outra pessoa; comentários bloqueantes foram resolvidos. Manual e contratos refletem a decisão aplicada.
3. Código/documentos foram integrados à branch de destino e a versão integrada foi validada. Artefato externo tem aprovação registrada e link acessível; não exige PR vazio.
4. As verificações pertinentes passaram: caminhos de sucesso e falha, integração e regressão afetada. Para comportamento com dados/pedidos, conferir autorização, isolamento, consentimento e idempotência quando aplicáveis. Documento sem mudança funcional exige revisão de conteúdo/links, não testes de código artificiais.
5. Não há defeito crítico conhecido no escopo entregue. Pendências que impedem o aceite bloqueiam Done; demais limitações ficam explícitas.
6. Documentação mínima, autoria, ambiente/versão, passos de reprodução, resultado esperado/observado e evidências estão acessíveis ao revisor; segredos e dados reais desnecessários não foram versionados.
7. Issue, manual, PR e Project refletem o estado real. Publicação do manual, CI verde ou PR aberto não equivalem a produto integrado/aceito.

## Critérios específicos e validação externa
Critérios de aceite descrevem o comportamento particular da história/tarefa; esta DoD define a qualidade comum. Teste simulado/local, sandbox externo, produção e publicação oficial são estados diferentes. A evidência deve identificar qual foi realmente executado; uma fixture não comprova acesso ao provedor.

## Quem confere
Autor registra as verificações. Revisor indicado na issue decide o aceite. Thiago coordena QA/integração; em tarefa dele, outra pessoa revisa. Para liberar o produto, verificar a versão integrada e o [checklist da S3](sprints/sprint-03.md), incluindo pacote, documentação e reprodução em ambiente novo.
