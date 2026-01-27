# Sistema de Assinatura de Domínio

## Descrição Geral
Implementação de um sistema de cobrança anual para domínios personalizados no valor de R$ 60,00, com monitoramento de vencimento e controle de acesso.

## Funcionalidades Implementadas

### 1. Cobrança Anual
- Valor fixo de R$ 60,00 por ano
- Cálculo automático de data de vencimento (1 ano após a compra)
- Renovação automática após pagamento

### 2. Monitoramento de Vencimento
- Aviso 30 dias antes do vencimento
- Destaque visual no painel administrativo
- Notificações sonoras (três toques) para alertas importantes

### 3. Controle de Acesso
- Bloqueio automático após vencimento
- Tela de bloqueio com informações de renovação
- Liberação imediata após pagamento

### 4. Interface de Pagamento
- Modal de renovação com opções de pagamento (PIX e Transferência)
- Processo de pagamento simulado
- Confirmação visual e sonora

## Arquivos Modificados

### admin.html
- Implementação completa do sistema de assinatura
- Funções para inicialização, verificação e controle
- Interface de pagamento integrada
- Verificação de vencimento com avisos

### index.html
- Inclusão dos dados de assinatura na criação do estabelecimento
- Definição de valores padrão para nova compra

### login.html
- Verificação e inicialização da assinatura durante o login
- Criação de assinatura padrão se não existir

### usuario.html, cozinha.html, balcao.html, garcom.html
- Verificação de vencimento antes do carregamento
- Tela de bloqueio caso a assinatura esteja expirada

## Estrutura de Dados

```javascript
{
  assinatura: {
    valorDominio: 60.00,           // Valor anual do domínio
    dataCompra: "ISO_DATE",        // Data da compra original
    dataVencimento: "ISO_DATE",    // Data de vencimento da assinatura
    ultimoPagamento: "ISO_DATE",   // Data do último pagamento
    statusPagamento: "pago",       // Status do pagamento
    avisoMostrado: false          // Indica se o aviso já foi mostrado
  }
}
```

## Fluxo de Funcionamento

1. **Criação do Estabelecimento**
   - Ao comprar o sistema, a assinatura é automaticamente criada
   - Data de vencimento definida para 1 ano após a compra

2. **Monitoramento Diário**
   - Sistema verifica diariamente o status da assinatura
   - Aviso aparece 30 dias antes do vencimento

3. **Aviso Prévio**
   - Notificação visual no painel administrativo
   - Notificação sonora (três toques)
   - Botão para renovação direta

4. **Vencimento**
   - Acesso bloqueado às áreas do sistema
   - Tela de bloqueio com informações de renovação
   - Somente admin pode renovar

5. **Renovação**
   - Processo de pagamento via modal
   - Atualização automática da data de vencimento
   - Liberação imediata do acesso

## Segurança
- Verificação realizada em todas as páginas principais
- Bloqueio imediato após vencimento
- Dados armazenados localmente com proteção

## Recursos Visuais
- Telas de aviso com design atrativo
- Cores diferenciadas para status (verde/válido, amarelo/aviso, vermelho/expirado)
- Notificações sonoras para eventos importantes
- Interface de pagamento intuitiva

## Teste do Sistema
- Arquivo `test_domain_subscription.html` para testes interativos
- Simulação de diferentes cenários de vencimento
- Verificação de funcionalidades completas