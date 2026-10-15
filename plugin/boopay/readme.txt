=== BooPay — Integração WooCommerce ===
Requires at least: 6.8
Requires PHP: 8.1
Stable tag: 0.1.0
License: GPL-2.0-or-later

Catálogo e eventos consentidos. Requer WooCommerce >= 10.2, HTTPS na loja/API e Action Scheduler (incluído no WooCommerce).

== Instalação ==
1. O operador configura BOOPAY_ALLOWED_API_ORIGINS no wp-config.php com a origem HTTPS exata da API.
2. Instale o ZIP por Plugins > Adicionar plugin > Enviar plugin e ative.
3. Em WooCommerce > BooPay, informe URL autorizada e código temporário de cinco minutos fornecido pelo operador.
4. Conecte, clique Sincronizar / retomar catálogo e acompanhe Ações agendadas (grupo boopay).
5. Atualize diagnóstico para conferir contagem de produtos/evento recebido.

Eventos desligados por padrão. Quando habilitados, o visitante precisa permitir a coleta e pode revogá-la na vitrine. Não envia cartão, endereço, email ou dados de pedidos. Pagamentos e checkout fora desta versão.

== Limites e recuperação ==
Até 20 produtos/página, 100 variações e 20 imagens por produto. Somente produtos simples/variáveis publicados com preço válido e URLs HTTPS. Falhas temporárias tentam até 5 vezes (30/60/120/240 s); permanentes ficam inspecionáveis para correção e repetição manual. Sem tráfego, execute o runner do Action Scheduler pelo cron/CLI da hospedagem.
Desconectar revoga a integração remotamente e apaga credenciais locais. Se API indisponível, peça revogação remota ao operador. Desativar apaga credenciais locais e cancela jobs; desconecte antes. Desinstalar remove configurações/jobs/revisões locais. Dados recebidos pela API exigem política de retenção do operador.

== Changelog ==
= 0.1.0 =
Contrato v1, pareamento, catálogo paginado/incremental, idempotência, fila, eventos opcionais e diagnóstico.
