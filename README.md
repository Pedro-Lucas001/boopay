# boopay

Repositório de desenvolvimento do MVP do Boopay. Este é o tutorial padrão do time: use o mesmo roteiro em todas as tarefas, desde assumir uma issue até entregar e receber revisão.

## Acessos do time

- [Quadro — execução do MVP](https://github.com/users/Pedro-Lucas001/projects/2/views/1)
- [Quadro — foco WooCommerce](https://github.com/users/Pedro-Lucas001/projects/2/views/6)
- [Backlog futuro](https://github.com/users/Pedro-Lucas001/projects/2/views/7)
- [Issues — tarefas e critérios de aceite](https://github.com/Pedro-Lucas001/boopay/issues)
- [Pull requests — entregas em revisão](https://github.com/Pedro-Lucas001/boopay/pulls)
- [RFCs — uma proposta por issue, com abordagem e validação](docs/rfcs/README.md)
- [Modelo de documentação da entrega](docs/entregas/MODELO.md)
- [Modelo de pull request](.github/PULL_REQUEST_TEMPLATE.md)

O quadro fica na conta Pedro-Lucas001 e está vinculado a este repositório. O Project é privado: para consultar ou editar os cards, use a conta convidada. A permissão do Project é separada da permissão para enviar arquivos ao repositório.

## O que cada integrante entrega

Em cada tarefa, o responsável entrega **o resultado pedido na issue, a documentação, as evidências de validação e a solicitação de revisão**. Código e documentos no repositório passam por uma branch e um PR. Um artefato externo, como um protótipo, pode ser revisado pela issue, com link e evidências; não abra um PR vazio.

Cada integrante escreve a documentação da própria entrega. Pedro Lucas, Conceição e Maria Luísa ajudam a organizar e revisar os documentos. Thiago coordena as prioridades, a revisão técnica e a validação. Use o revisor indicado na tarefa; se não houver um definido, combine com Thiago.

**Rotina:** issue → branch → trabalho e documentação → commit → push → PR → revisão → integração e validação → Done.

## Antes de implementar — leia a RFC da issue

Cada uma das 85 issues RB-001 a RB-085 tem uma proposta em `docs/rfcs/RB-XXX.md`. Encontre a sua no [índice de RFCs](docs/rfcs/README.md). Confira a abordagem, os critérios, as dependências e o plano de validação. Registre dúvidas na issue e combine a revisão das decisões com o revisor.

Todas começam como **Proposta — aguardando revisão**. Aprovar uma RFC não significa concluir a implementação. Atualize a decisão no documento, execute a tarefa e anexe evidências reais antes de mover o card para Done. Para um PR que só altera a proposta, use `Refs #NUMERO`; reserve `Closes #NUMERO` para o PR que cumpre integralmente o aceite.

## Antes da primeira tarefa — faça uma única vez

### Instalar o Git e abrir o terminal

Instale o [Git pelo site oficial](https://git-scm.com/install/). Reabra o terminal e execute:

```bash
git --version
```

Deve aparecer uma versão. Os comandos deste guia funcionam no PowerShell ou no Git Bash. No VS Code, abra **Terminal → Novo Terminal**. Execute uma linha por vez; se houver erro, entenda o motivo antes de seguir.

### Baixar o repositório

Abra o terminal na pasta onde deseja guardar o projeto:

```bash
git clone https://github.com/Pedro-Lucas001/boopay.git
cd boopay
git remote -v
```

`clone` cria a pasta do projeto; `cd` entra nela. `remote -v` deve mostrar `origin` apontando para **Pedro-Lucas001/boopay**. Todos os próximos comandos são executados dentro dessa pasta.

Se já clonou, abra o terminal na pasta existente. Não precisa clonar a cada tarefa.

### Configurar seu nome e email de commits

Substitua os textos entre aspas pelos seus dados:

```bash
git config user.name "SEU NOME"
git config user.email "SEU_EMAIL_DE_COMMITS"
git config user.name
git config user.email
```

Use um email verificado do GitHub ou o email `noreply` disponível em **GitHub → Settings → Emails**. A configuração acima vale para este repositório e identifica a autoria; ela não faz login.

No primeiro push por HTTPS, pode aparecer uma janela de autenticação. Entre com a conta convidada para o repositório. No Windows, o Git Credential Manager incluído no Git for Windows pode conduzir o login pelo navegador. A senha da conta GitHub não funciona como senha para operações Git por HTTPS; se precisar de ajuda, consulte a [orientação de autenticação](https://docs.github.com/en/get-started/git-basics/caching-your-github-credentials-in-git).

**Pronto para começar quando:** o Git responde, o terminal está na pasta `boopay`, o remoto está correto e sua autoria está configurada.

## Roteiro de toda tarefa — repita a partir daqui

O exemplo abaixo usa **RB-001**, a branch `docs/rb-001-criterios-plugin` e o arquivo `docs/entregas/RB-001.md`. Eles ilustram uma entrega de documentação. **Troque o código, a descrição da branch e os caminhos pelos da sua tarefa.** Não crie entregas de exemplo para uma issue que está com outra pessoa.

### 1. Abrir a issue e confirmar o trabalho

1. Abra o card no quadro e entre na issue.
2. Leia o objetivo, o escopo, as dependências e cada critério de aceite.
3. Confirme que você é o responsável e quem vai revisar. Se não houver responsável visível, confirme a divisão com Thiago antes de assumir.
4. Se seu usuário não aparecer em **Assignees**, registre a responsabilidade confirmada em um comentário e peça o ajuste.
5. Verifique se as dependências necessárias estão disponíveis. Só avance quando souber o que precisa entregar e como será conferido.

Registre o início na issue:

```text
Vou iniciar esta tarefa.
Responsável: [nome/usuário]
Entrega prevista: [data]
Revisor: [nome/usuário]
Dependências: [nenhuma ou links]
```

**Resultado esperado:** tarefa atribuída ou responsabilidade registrada, escopo entendido e dependências disponíveis. Ao iniciar o trabalho, mova o card para **In progress**.

O código **RB-001** é o identificador do planejamento. **#1** é o número da issue no GitHub. Eles podem ser diferentes; para relacionar um PR, copie o número real que aparece na issue.

### 2. Atualizar a main e criar sua branch

No terminal da pasta `boopay`, confira:

```bash
git status
```

Se houver alterações pendentes de outra tarefa, registre e envie esse trabalho na branch correta antes de trocar. Com a pasta de trabalho limpa:

```bash
git switch main
git pull --ff-only origin main
git switch -c docs/rb-001-criterios-plugin
git branch --show-current
```

| Comando | Para que serve |
| --- | --- |
| `git switch main` | Volta para a branch principal. |
| `git pull --ff-only origin main` | Recebe a versão atual da main; para se houver divergência de histórico. |
| `git switch -c NOME` | Cria a branch da tarefa e muda para ela. |
| `git branch --show-current` | Confirma em qual branch você está. |

Use `docs/rb-XXX-descricao` para documentação, `feat/rb-XXX-descricao` para funcionalidade ou `fix/rb-XXX-descricao` para correção. Troque `XXX` pelo código; use minúsculas, sem espaços e sem acentos.

**Resultado esperado:** o último comando mostra sua branch. Crie a branch antes de editar os arquivos.

### 3. Executar o trabalho pedido na issue

Abra a pasta clonada no editor e produza os arquivos ou artefatos necessários para os critérios de aceite. A branch organiza o trabalho; os comandos Git não implementam a funcionalidade por você.

- **Código:** implemente o comportamento pedido e confira os cenários da issue, incluindo falhas relevantes.
- **Banco de dados:** produza o modelo ou script solicitado, registre as decisões e confira os requisitos atendidos.
- **Design e frontend:** produza as telas, estados ou protótipo previstos e registre como conferir o resultado.
- **Pesquisa e apresentação:** produza o material solicitado, com fontes ou roteiro quando aplicável.

Use as instruções de execução do componente em que está trabalhando. Se ainda não existirem, combine o ambiente e a forma de validar com o revisor; não copie um comando de instalação ou teste de outro componente sem conferir.

Trabalhe no escopo combinado. Se surgir outra necessidade, registre na issue e combine antes de ampliar a entrega.

**Resultado esperado:** o resultado solicitado está disponível para conferência, com as verificações realizadas e as pendências identificadas.

### 4. Documentar a entrega e guardar evidências

No editor, copie [docs/entregas/MODELO.md](docs/entregas/MODELO.md) para um arquivo com o código da tarefa, como `docs/entregas/RB-001.md`. Mantenha o modelo original para os próximos integrantes.

Preencha objetivo, autor, issue, revisor, arquivos ou artefatos, decisões, passos de validação, resultado de cada critério e evidências. Quando houver documentação adequada no componente, atualize-a e indique o caminho na issue; evite duplicar o mesmo conteúdo.

A evidência deve permitir conferir a entrega: capturas ou vídeo de uma interação, resultado de teste, diagramas, logs sem credenciais ou links de artefatos acessíveis ao time. Informe **o que foi verificado e o resultado observado**. Um critério não executado deve aparecer como pendência.

**Resultado esperado:** outra pessoa consegue entender a entrega, repetir a conferência e localizar as evidências.

### 5. Conferir arquivos, fazer commit e push

Salve os arquivos no editor e confira:

```bash
git status
git diff
```

`status` lista arquivos novos e alterados. `diff` mostra mudanças em arquivos já acompanhados pelo Git; confira os arquivos novos no editor. Se o visualizador ocupar várias telas, use as setas e pressione `q` para sair.

Selecione os arquivos que pertencem à tarefa. O caminho abaixo é do exemplo; use os caminhos reais e repita `git add` para os demais arquivos de código ou documentação:

```bash
git add docs/entregas/RB-001.md
git diff --staged
git status
```

`git add` seleciona a versão atual do arquivo para o commit. `git diff --staged` mostra exatamente o que será registrado. Se editar o arquivo depois de adicioná-lo, salve e execute `git add` novamente. Coloque caminhos com espaços entre aspas.

Confira se os arquivos selecionados pertencem à tarefa e se não contêm credenciais ou dados pessoais desnecessários. Registre e envie:

```bash
git commit -m "docs: registrar criterios do plugin RB-001"
git push -u origin docs/rb-001-criterios-plugin
git status
```

Adapte a mensagem e o nome da branch. O commit registra as alterações no computador; o push as envia ao GitHub. `-u` configura o acompanhamento da branch remota para os próximos envios.

**Resultado esperado:** o push termina sem erro e a branch aparece no GitHub com seus commits. O PR ainda precisa ser aberto.

### 6. Abrir o PR e pedir revisão

1. Entre em [Pull requests → New pull request](https://github.com/Pedro-Lucas001/boopay/pulls). Se aparecer **Compare & pull request** para sua branch, pode usá-lo.
2. Confira o repositório de destino: **Pedro-Lucas001/boopay**.
3. Selecione **base: main** e **compare: sua branch**.
4. Confira a comparação dos arquivos e clique em **Create pull request** para abrir o formulário, quando necessário.
5. Escreva um título como `[RB-001] Documentar criterios de aceite do plugin`, adaptado à sua entrega.
6. Preencha o modelo que aparece na descrição: issue, resultado, passos de validação, documentação, evidências, pendências e revisão solicitada. Apague as orientações e marque apenas verificações realizadas.
7. Em **Reviewers**, solicite o revisor da tarefa. Se não conseguir selecioná-lo, registre o pedido na issue e marque o usuário correto.
8. Clique em **Create pull request**. Se ainda estiver incompleto, use **Create draft pull request**, quando disponível, e explique o que falta.
9. Copie o link do PR para a issue. Quando a entrega estiver pronta e a revisão solicitada, mova o card para **In review**.

Use `Refs #N` para indicar a issue. Só use `Closes #N` quando o PR entregar **todo o escopo** dela. Ao integrar um PR com `Closes` na branch principal, o GitHub fecha a issue automaticamente; isso não substitui a validação final nem atualiza necessariamente o card. Substitua `N` pelo número real da issue.

Para uma tarefa que produziu apenas um artefato externo, solicite a revisão na issue com o link e as evidências. Se também houver arquivos de documentação para integrar, envie-os por PR.

Registre a entrega na issue:

```text
Entrega disponível para revisão.
PR: [link, se houver]
Documentação/artefato: [caminho ou link]
Validação realizada: [passos e resultados]
Pendências: [nenhuma ou descrição]
Revisão solicitada a: [responsável]
```

**Resultado esperado:** entrega acessível, revisão solicitada, issue com os links e card em **In review**. Abrir um PR não significa que ele foi aprovado ou integrado.

### 7. Responder à revisão e enviar ajustes

Leia os comentários do PR. Para ajustar, continue **na mesma branch**. Confira seu nome e, com a pasta de trabalho limpa, receba atualizações dessa branch se ela já tiver sido publicada:

```bash
git branch --show-current
git status
git pull --ff-only
```

Edite e salve os arquivos. Depois execute, usando os caminhos e a mensagem da sua alteração:

```bash
git add docs/entregas/RB-001.md
git diff --staged
git commit -m "docs: ajustar criterios apos revisao RB-001"
git push
```

O PR aberto recebe esses commits automaticamente. Responda aos comentários explicando o ajuste, atualize documentação/evidências e peça nova revisão. Não abra outro PR para corrigir a mesma entrega.

Se o PR estiver em rascunho, use **Ready for review** quando estiver pronto.

**Resultado esperado:** comentários tratados, evidências atualizadas e nova revisão solicitada.

### 8. Integrar, validar e concluir

O revisor confere a issue, os arquivos, a documentação e a validação pertinente. No PR, usa **Files changed → Review changes** para comentar, pedir ajustes ou aprovar.

O merge fica com o revisor ou a pessoa combinada para integrar a entrega, após aprovação e verificações aplicáveis. Não integre seu próprio PR sem combinar. Para artefatos externos, registre a aprovação na issue.

Depois da integração ou aprovação:

1. Confirme o resultado final contra os critérios de aceite.
2. Registre a revisão e a validação final na documentação ou na issue.
3. Se houver falha ou pendência dentro do escopo, trate antes de concluir.
4. Feche a issue, se ainda estiver aberta, e mova o card para **Done** quando a entrega estiver aceita.

**Checklist de conclusão:**

- [ ] Todos os critérios de aceite conferidos e atendidos.
- [ ] Documentação e evidências acessíveis ao time.
- [ ] Revisão aprovada e ajustes resolvidos.
- [ ] Arquivos integrados à main, quando aplicável.
- [ ] Validação final registrada e pendências do escopo tratadas.
- [ ] Issue e card atualizados.

**Resultado esperado:** entrega aceita e rastreável. Para a próxima tarefa, com a pasta de trabalho limpa, volte à main e repita o roteiro:

```bash
git switch main
git pull --ff-only origin main
```

## O que fazer todos os dias

| Momento | Ação |
| --- | --- |
| Ao começar | Confira a issue, os comentários e a branch; retome o trabalho combinado. |
| Durante o trabalho | Registre dúvidas ou bloqueios na issue, com o que tentou e a ajuda necessária. |
| Antes de encerrar | Salve o trabalho, confira os arquivos e faça commit/push dos avanços que devem ser compartilhados na branch. |
| Ao entregar | Disponibilize documentação/evidências, abra o PR ou registre o artefato, peça revisão e atualize o card. |
| Depois da revisão | Faça ajustes na mesma branch e atualize a entrega até a aceitação. |

Comentário de andamento:

```text
Andamento: [o que foi feito]
Próximo passo: [o que falta]
Bloqueio: [nenhum ou problema]
Preciso de: [ajuda/decisão, se houver]
```

## Como usar as colunas do quadro

| Coluna | Quando usar |
| --- | --- |
| Backlog | Planejada, ainda não liberada para começar. |
| Ready | Responsável definido, escopo entendido e dependências disponíveis. |
| In progress | Trabalho iniciado. |
| In review | Entrega disponível, documentação/evidências registradas e revisão solicitada. |
| Done | Entrega revisada, integrada quando aplicável e validada. |

Arraste o card ou altere o campo **Status**. Se ficar bloqueado, mantenha o status que corresponde ao trabalho e registre o bloqueio na issue.

## Termos que você vai encontrar

| Termo | Significado |
| --- | --- |
| Issue | Tarefa com escopo e critérios de aceite. |
| Card | Representação da tarefa no quadro. |
| Main | Branch principal do projeto. |
| Branch | Linha de trabalho separada para sua tarefa. |
| Commit | Registro de alterações no computador. |
| Push | Envio dos commits ao GitHub. |
| Pull | Recebimento de atualizações da branch remota. |
| PR | Pedido para revisar e integrar alterações de uma branch em outra. |
| Review | Conferência da entrega por outra pessoa. |
| Merge | Integração das alterações à branch de destino. |

<details>
<summary>Dúvidas e comandos de apoio</summary>

### Retomar uma branch existente

Com a pasta de trabalho limpa, use o nome da sua branch:

```bash
git switch docs/rb-001-criterios-plugin
git pull --ff-only
```

O pull recebe atualizações da branch remota acompanhada. Se ela ainda não foi publicada com `git push -u`, não haverá esse acompanhamento.

### Tirar um arquivo da seleção antes do commit

```bash
git restore --staged docs/entregas/RB-001.md
git status
```

Com `--staged`, as edições continuam no computador e o arquivo sai da seleção do commit. Não remova essa opção: `git restore` sem ela pode descartar alterações.

### Receber novidades da main durante a tarefa

Se precisar dessas alterações, deixe a pasta de trabalho limpa e confirme que está na branch da tarefa:

```bash
git status
git branch --show-current
git fetch origin
git merge --no-edit origin/main
```

`fetch` recebe o histórico; `merge` integra a main remota à branch atual. Se houver conflito, peça ajuda ao revisor antes de escolher os trechos. Após uma integração bem-sucedida, repita a validação e envie com `git push`.

### Erros comuns

| Situação | Como agir |
| --- | --- |
| Git não foi reconhecido | Instale o Git, reabra o terminal e confira com `git --version`. |
| Not a git repository | Entre na pasta clonada e execute `git status`. |
| Nothing to commit | Confira se salvou os arquivos, está na pasta correta e usou `git add` nos arquivos alterados. |
| Branch already exists | Retome com `git switch NOME-DA-BRANCH`; `-c` serve para criar uma nova. |
| Push rejeitado ou pull --ff-only falhou | Peça ajuda para conferir o histórico e sincronizar; não use `--force` para contornar. |
| Não consigo enviar ao repositório | Confira a conta de autenticação e se aceitou o convite. Peça ao proprietário para verificar o acesso. |
| Não há diferenças para abrir PR | Confira o commit, o push e se compare é a branch da tarefa. |
| Não consigo editar o card | Consulte o quadro conectado à conta com permissão de edição. |
| Usuário não aparece em Assignees | Registre a responsabilidade confirmada na issue e peça o ajuste. |
| Não sei validar a entrega | Explique o que tentou na issue e combine os passos com o revisor. |

Envie a mensagem de erro e os passos realizados ao pedir ajuda, sem credenciais. Não apague arquivos ou histórico para tentar resolver um erro que ainda não entendeu.

</details>

## Referências

- [Git: branches](https://git-scm.com/docs/git-switch), [seleção de arquivos](https://git-scm.com/docs/git-add), [commits](https://git-scm.com/docs/git-commit) e [envio](https://git-scm.com/docs/git-push)
- [Relacionar PRs às issues](https://docs.github.com/en/issues/tracking-your-work-with-issues/using-issues/linking-a-pull-request-to-an-issue)
