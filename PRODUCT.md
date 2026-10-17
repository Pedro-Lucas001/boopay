# Boopay

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Lojistas/operadores autorizados administram suas lojas; compradores descobrem produtos e revisam compras na conversa. Time técnico integra e valida em ambiente de teste. Fonte: docs/visao-produto.md e divisão confirmada do time.

## Product Purpose

Conectar conversa e compra rastreável, com catálogo real, cotação autoritativa, confirmação explícita e isolamento entre lojas.

## Capabilities and Constraints

API Fastify/TypeScript e plugin WooCommerce existentes. Console multiloja desta tarefa usa HTML/CSS/JavaScript servidos pela API, para seleção de contexto/consulta; não escolhe uma stack para o frontend completo do time. Dados comerciais sempre vêm da API autenticada. Sem compras reais, homologação presumida ou dados pessoais reais na QA.

## Operating Context

S1 em desenvolvimento; checkpoint de Thiago 19/10/2026 e entrega final confirmada em 04/11. Credenciais somente locais/servidor. Acesso de operador é separado da credencial do plugin e do token administrativo.

## Brand Commitments

Nome Boopay e linguagem em português. Esta extensão funcional herda a clareza da administração WooCommerce e não altera identidade, mascote ou frontend aprovado pelo time.
