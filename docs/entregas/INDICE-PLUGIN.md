# Índice da entrega WooCommerce

Use este índice junto ao quadro `label:m1-woocommerce`. Responsáveis originais das issues preservados; implementação complementar e QA por Thiago Ventura. Autoria inicial de contrato/rotas por Pedro Lucas. Documentos/PRs não equivalem a aceite.

| Cards | Documento | Decisão e teste/evidência |
| --- | --- | --- |
| RB-001 #1 | [Aceite](./RB-001.md) | Escopo, versões e P01–P17 |
| RB-002 #2 | [Contribuição](./RB-002.md) | Branch → PR → revisão; checks; PR #86 integrado |
| RB-003 #58 | Este índice + [modelo](./MODELO.md) | Autoria/card/decisão/teste em cada entrega |
| RB-004 #22 | [Ambiente](./AMBIENTE-PLUGIN.md) | Setup com hashes e loja sintética |
| RB-005 #36 | [Contrato v1](../contratos/plugin-v1.md) | Esquema executável + fixtures; revisão da main pendente de complementação |
| RB-006 #47, RB-007 #59, RB-016 #48, RB-019 #60 | [API](./API-PLUGIN.md) | Identidade, migração, deduplicação, eventos/saúde; [log](../evidencias/API-PLUGIN/check.log) |
| RB-008 #23, RB-009 #68, RB-010 #77, RB-012 #24 | [Plugin](./PLUGIN-WOOCOMMERCE.md) | Ciclo, tela, estados, permissão e pareamento |
| RB-011 #3 | [Credenciais](./RB-011.md) | Código de uso único, vínculo/revogação e teste |
| RB-013 #4 | [Assinatura](./RB-013.md) | Corpo exato, tenant, replay e transporte |
| RB-014 #25, RB-015 #37, RB-017 #26, RB-018 #78 | [Plugin](./PLUGIN-WOOCOMMERCE.md) | Hooks, páginas, retries e consentimento; [log](../evidencias/PLUGIN/check.log) |
| RB-020 #5 | [QA](./RB-020.md) | [Resultado WordPress](../evidencias/WORDPRESS/results.json), [backend](../evidencias/RB-020/backend-local.json) |
| RB-021 #49 | [Instalação e pacote](./AMBIENTE-PLUGIN.md) | ZIP/manifesto no artefato da CI; reprodução humana pendente |
| RB-022 #6 | [Demonstração](./RB-022.md) | Roteiro + resultados reproduzíveis; gravação/ensaio humanos pendentes |

## Ordem de revisão

PR #86 já integrado. #87 (aceite) e #88 (conexão) têm base main. Depois #89 (assinatura), #92 (API completa), #93 (plugin) e #94 (empacotamento/QA). #90/#91 foram encerrados como substituídos por #94, sem merge. Todos os PRs ativos continuam aguardando revisão humana. Os jobs `validate` e `wordpress` passaram na [CI da entrega](https://github.com/Pedro-Lucas001/boopay/actions/runs/38281186583).

Revisar, integrar pela ordem e executar novamente na main integrada. Só então, com revisão e critérios atendidos, mover os cards para Feito. Pedro RB-005/RB-015: o código original da main era parcial; complementações precisam ser revisadas, por isso a revisão não aprovou Feito.
