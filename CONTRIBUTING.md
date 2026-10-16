# Contribuir no Boopay

O [README](README.md) ensina o fluxo pelo terminal. Para cada issue: leia o manual,
crie uma branch curta, implemente, valide e abra um PR. Não envie trabalho
diretamente à main. Não integre seu PR sem revisão de outra pessoa.

## Preparação

```bash
npm ci --ignore-scripts
npm run db:generate
npm run check
```

Use Node 22 e PHP 8.3 para as verificações. O banco de desenvolvimento é local:
configure DATABASE_URL antes de usar as rotas que consultam persistência.
Não versione .env, bancos locais, credenciais nem dados reais.

## Revisão

1. Abra o PR com base e branch corretas.
2. Vincule issue, manual e documento de entrega.
3. Registre comandos, resultado, limites e riscos.
4. Use Draft enquanto faltar implementação ou evidência obrigatória.
5. Solicite revisão de Pedro Lucas ou do responsável pela dependência.
6. Resolva comentários e repita verificações afetadas.
7. O revisor decide o aceite; o autor não aprova o próprio PR.

Um PR parcial usa `Refs #NUMERO`; `Closes #NUMERO` exige aceite integral.
Testes locais não provam instalação limpa, HPOS ou sucesso na loja WooCommerce.

## Proteção da main

Proposta para o proprietário: exigir PR, uma aprovação, resolução de comentários e
o job validate. Esta entrega configura o workflow, mas **não altera regras de
proteção nem afirma que estão ativas**. Pedro deve conferir Settings → Rules
e aplicar as regras permitidas pelo plano. A demonstração do fluxo por todos os
integrantes permanece uma validação humana pendente.

## Planejamento e qualidade compartilhada

Consulte a [visão](docs/visao-produto.md), o [acordo](docs/acordo-trabalho.md), a [DoD](docs/definition-of-done.md) e a [sprint vigente](docs/sprints/README.md). Preserve o código RB e o número real da issue; reutilize as tarefas existentes. Atualize o vínculo de história/manual/sprint quando houver decisão de escopo. O [registro de IA](docs/uso-ia.md) informa apoio, correções e revisão humana.

Para alterações somente documentais, execute `npm run check:docs` e `git diff --check`; confira títulos, responsáveis, datas, links e correspondência com as issues. Para código, execute também as verificações pertinentes ao componente e registre ambiente/limites. Não declarar proteção de branch, aprovação ou validação externa sem conferência.
