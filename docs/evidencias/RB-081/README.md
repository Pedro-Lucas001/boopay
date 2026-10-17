# Evidências multiloja — 17/10/2026

Ambiente localhost descartável, dados sintéticos e API real da branch. Não são capturas de lojas comerciais nem homologação externa.

- [Recife / desktop](recife-desktop.png): produto ID 1 com preço 39.90.
- [Olinda / desktop](olinda-desktop.png): seleção muda contexto, mesmo ID 1 com preço 59.90.
- [Recife / mobile 390×844](recife-mobile.png): operador restrito tem somente a loja Recife; tabela permite rolagem horizontal.

Navegação executada pelo navegador integrado: login, consulta, seleção de Olinda, logout e login restrito. Tokens não aparecem nas imagens e não são publicados. Foco/labels e composição mobile inspecionados. Detector Impeccable executou em modo degradado, sem parsers completos; ausência de findings não foi usada como prova de contraste/acessibilidade.

`npm run check`: compilação, sintaxe JS/PHP, 6 grupos PHP, links e **8 testes Node** passaram; 2 testes multiloja adicionais e 6 de regressão. Casos detalhados no [teste](../../../tests/tenant-isolation.test.ts) e [contrato](../../contratos/multiloja.md). Revisão independente pendente.
