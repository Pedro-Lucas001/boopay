# Plugin WooCommerce 0.1.0

Implementação: Thiago Ventura. Responsáveis originais dos cards e autoria de Pedro no backend preservados; revisão da equipe pendente. Escopo: RB-008/009/010/012/014/015/017/018, issues #23/#68/#77/#24/#25/#37/#26/#78.

## Estrutura e decisões

`plugin/boopay`: bootstrap com guarda de dependência; tela/pareamento; transporte assinado; catálogo/fila; eventos consentidos; uninstall. PHP >=8.1, WordPress >=6.8, WooCommerce >=10.2. Ambiente efetivamente testado e limitações ficam no relatório QA, sem inferir compatibilidade com todas as versões maiores.

Ativar cria sequência de revisão e configurações, tracking desligado. WooCommerce ausente/incompatível exibe aviso e pausa hooks, sem fatal. Desativar cancela fila e apaga credenciais locais; desconectar antes para revogar remotamente. Desinstalar remove opções/jobs/sequência. Credenciais são opções não autoload, nunca enviadas ao navegador, impressas no HTML, incluídas em jobs ou logs. Acesso ao banco/servidor deve permanecer restrito ao operador.

Revisões usam sequência auto-incrementada do banco WordPress, independente de relógio e SKU. Não restaurar backup do banco da loja mantendo a mesma integração da API: desconectar e parear novamente para iniciar nova identidade antes de reenviar.

## Configuração e estados (RB-009/010/012)

Protótipo funcional: tela WooCommerce → BooPay implementada, com HTML real capturado na QA. Contexto nativo do WordPress, rótulos associados, botões de ação, texto de estado e diagnóstico. Todos os POST administrativos exigem `manage_woocommerce` e nonce; escape na saída e sanitização na entrada. API permitida é definida pelo operador via `BOOPAY_ALLOWED_API_ORIGINS`, fora do formulário.

| Estado/ação | Comportamento e texto |
| --- | --- |
| Desconectado | URL HTTPS autorizada, código temporário oculto; botão Conectar |
| Conectado | Sincronizar/retomar, repetir falhas, atualizar diagnóstico, desconectar |
| Código inválido/usado/expirado | Solicitar código novo; código nunca é persistido ou reapresentado |
| API indisponível | Mensagem sanitizada; nova tentativa exige código novo se o pareamento for incerto |
| Destino não autorizado | Bloqueio antes do HTTP; consultar operador |
| Revogada/401 | Parar fila, apagar credenciais e exigir reconexão |
| Desconectar com API fora | Parar localmente e solicitar revogação remota ao operador |
| Tracking opcional | Desligado por padrão; habilitar oferece consentimento na vitrine |

## Catálogo e hooks (RB-014/015)

Sincronização inicial por keyset ID crescente: 20 produtos por página, cursor persistido somente depois do ACK da API; lote vazio termina com sucesso. Action Scheduler evita bloquear administração. Snapshot completo usa WC CRUD para preço/estoque/imagens/variações. Tipos/preços/limites não suportados geram falha explícita; não enviar catálogo parcial como sucesso. Restabeleça o produto e repita a ação com falha ou retome a página.

| Hook | Resultado |
| --- | --- |
| woocommerce_new_product / woocommerce_update_product | Upsert ou tombstone para produto não publicado |
| woocommerce_new_product_variation / woocommerce_update_product_variation | Snapshot completo do pai |
| woocommerce_product_set_stock / woocommerce_variation_set_stock | Snapshot com estoque/preço atual |
| before_delete_post product | Tombstone com nova revisão antes de remover |
| before_delete_post product_variation | Agendar snapshot do pai após remover a variação |
| trashed_post / untrashed_post | Tombstone ou snapshot publicado |

O plugin não escreve produtos nem chama save em resposta a envios: evita ciclo de sincronização. Remover a última variação envia array vazio. Incrementais seguem a mesma fila e revisão da sincronização inicial. Exclusões ocorridas enquanto a integração está desativada não são capturadas: nova conexão deve usar integração nova, e a projeção antiga exige política do operador.

## Fila e recuperação (RB-017)

Jobs persistem payload + event_id + integração, sem credenciais. AS recebe apenas ID do job. Timeout 10 s; TLS verificado e redirects bloqueados. Retry preserva payload/event_id, gera nonce HMAC novo: falha de transporte, 429 e 5xx; até cinco tentativas totais, atrasos 30/60/120/240 s. 4xx permanente termina em failed para correção manual, sem loop. Ações inspecionáveis em WooCommerce → Status → Ações agendadas, grupo boopay; logs contêm somente estado, tentativa e instante. Botão Repetir trabalhos com falha retoma o mesmo payload após corrigir a causa; mudança do produto gera novo snapshot/event_id.

O runner depende de tráfego/cron da hospedagem. Nunca manter a fila rodando após desconexão; cancelar também refresh de pai. Inicialização/retomada e retries preservam cursor. 401 interrompe envios e exige pareamento novo.

## Eventos e consentimento (RB-018)

Tracking desligado = nenhum script de eventos carregado e nenhuma sessão criada. Ao habilitar, a vitrine oferece Permitir e Recusar/revogar. Consentimento por 24 horas em cookie Secure/HttpOnly/SameSite=Lax assinado; sessão aleatória pseudonimizada por HMAC com salt da loja. Rota WordPress valida origem/nonce e cookie; limite de 30 eventos/min por pseudônimo. view ao carregar página consentida, exit_intent ao sair pelo topo com mouse (não se aplica a touch), add_to_cart somente após hook de sucesso WooCommerce, incluindo Store API. Sem email, endereço, cartão, URL ou conteúdo livre; catálogo usa dados públicos de produtos. Revogar para novos eventos; eventos já entregues exigem política de retenção do operador. Integrar outra CMP exige adaptar consentimento antes de habilitar na loja real.

## Validação e limites

[Contrato v1](../contratos/plugin-v1.md); checks PHP/JS e segurança; QA real WordPress/ZIP/API/Action Scheduler será anexada pelo PR de validação. O relatório informa exatamente casos executados e armazenamento usado. HPOS: nenhuma leitura/escrita de pedido, declaração de compatibilidade no bootstrap; não qualifica fluxo de checkout/pagamentos. Teste em MySQL/MariaDB da hospedagem, revisão humana e reprodução por outra pessoa continuam requisitos antes de aceite final.

## Recuperação de release

Desconectar, salvar evidências sanitizadas, desativar e substituir ZIP pela versão anterior compatível com a API. Não apagar recibos/tombstones da API. Reinstalação que reinicia sequência ou restaura banco exige nova integração para não aceitar revisões antigas.

Referências oficiais: [Action Scheduler](https://actionscheduler.org/api/), [compatibilidade HPOS](https://developer.woocommerce.com/docs/features/orders/high-performance-order-storage/recipe-book/).
