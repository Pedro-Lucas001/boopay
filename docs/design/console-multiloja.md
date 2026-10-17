# Console multiloja — superfície Operate

Escopo: selecionar uma loja autorizada e conferir catálogo/saúde reais. Usuário e propósito vêm da issue #19; não há descoberta ou identidade nova. Referência incumbente: formulário administrativo e ações nativas em `plugin/boopay/includes/class-boopay-plugin.php`.

Composição estreita de formulário → seletor → resumo e tabela, adequada a administração em desktop/mobile. Branco, texto escuro, ação azul de administração e foco forte; tipografia de sistema por ser utilitário operacional. Sem gráficos, dados fictícios, marketing ou cartões decorativos. A tela não substitui o frontend completo RB-030.

Estados: desconectado, conectando, sem lojas, carregando loja, catálogo vazio, dados, acesso expirado e erro recuperável. Token somente em memória, limpo ao sair; seleção rápida cancela consulta anterior e descarta resposta atrasada. Navegação por teclado, label explícito, tabela com cabeçalhos e status aria-live.
