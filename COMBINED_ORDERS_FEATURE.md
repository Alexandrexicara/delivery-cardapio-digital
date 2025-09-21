# Funcionalidade de Pedidos Combinados

## Visão Geral

A funcionalidade de "Pedidos Combinados" permite que todos os pedidos sejam exibidos em um único container com cálculo automático dos valores totais. Esta feature facilita a visualização e processamento em lote de todos os pedidos pendentes.

## Características Principais

1. **Exibição Unificada**: Todos os pedidos são mostrados em um único container, independentemente da mesa ou status
2. **Filtros Avançados**: Filtragem por data, mesa, status e pagamento
3. **Cálculo Automático**: Totais são calculados automaticamente em tempo real
4. **Processamento em Lote**: Capacidade de confirmar pagamento de todos os pedidos pendentes de uma vez

## Como Funciona

### Exibição de Pedidos

Os pedidos são exibidos em cards individuais dentro de um container principal. Cada card contém:
- ID do pedido
- Número da mesa
- Informações do cliente
- Itens do pedido com quantidades e valores
- Subtotal, taxa de serviço e total
- Status do pedido e pagamento

### Resumo Financeiro

O resumo financeiro mostra:
- **Subtotal Geral**: Soma de todos os subtotais dos pedidos
- **Taxa de Serviço (10%)**: 10% aplicado ao subtotal geral
- **Total Geral**: Subtotal + Taxa de serviço
- **Total Pago**: Soma dos valores de pedidos já pagos
- **Total Pendente**: Soma dos valores de pedidos ainda não pagos

### Processamento de Pagamentos

O botão "Processar Todos os Pagamentos" permite:
1. Identificar todos os pedidos com status de pagamento "pendente"
2. Confirmar o pagamento de todos esses pedidos em uma única ação
3. Atualizar automaticamente o resumo financeiro

## Benefícios

- **Eficiência**: Processamento rápido de múltiplos pedidos
- **Visibilidade**: Visão clara de todos os pedidos em andamento
- **Controle Financeiro**: Acompanhamento em tempo real das receitas
- **Redução de Erros**: Menos cliques e interações manuais reduzem possibilidade de erros

## Como Usar

1. Acesse a aba "Pedidos Combinados" no painel administrativo
2. Utilize os filtros para refinar a visualização conforme necessário
3. Revise os pedidos exibidos no container
4. Verifique o resumo financeiro para informações monetárias
5. Clique em "Processar Todos os Pagamentos" para confirmar pagamentos pendentes

## Considerações Técnicas

- Os cálculos são feitos em tempo real conforme os pedidos são adicionados ou modificados
- O sistema mantém consistência entre o status individual dos pedidos e o resumo geral
- Todos os valores são atualizados automaticamente após qualquer alteração