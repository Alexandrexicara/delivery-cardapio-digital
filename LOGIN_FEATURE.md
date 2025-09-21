# Feature de Login para Área Administrativa

## Visão Geral

Esta feature implementa um sistema de autenticação para a área administrativa do Cardápio Digital Universal, substituindo o sistema anterior baseado em flags simples por um sistema de login completo com autenticação por e-mail e senha personalizadas.

## Funcionalidades

### 1. Página de Login
- Interface amigável e responsiva
- Validação de credenciais (e-mail e senha)
- Mensagens de erro claras
- Opção de recuperação de senha

### 2. Autenticação
- Verificação de credenciais (e-mail/senha)
- Armazenamento seguro de senha durante o registro
- Validação de confirmação de senha
- Verificação de força de senha (mínimo 6 caracteres)
- Armazenamento de sessão em localStorage
- Redirecionamento automático para usuários autenticados

### 3. Controle de Acesso
- Proteção de todas as páginas administrativas
- Redirecionamento automático para login quando não autenticado
- Logout seguro

### 4. Acesso Direto
- Botão de login na página inicial para acesso direto à área administrativa
- Botão de login na mensagem de sucesso após aquisição do sistema

## Como Usar

### Registro (Aquisição do Sistema)
1. Acesse a página inicial e clique em "Adquirir Sistema"
2. Preencha todos os dados obrigatórios
3. Crie uma senha para acessar a área administrativa
4. Confirme a senha
5. Selecione a forma de pagamento
6. Clique em "Finalizar Compra"

### Acessando o Sistema
1. Acesse a página de login através do endereço `login.html` ou pelos botões de login na página inicial
2. Insira as credenciais:
   - E-mail: O e-mail cadastrado durante o registro
   - Senha: A senha criada durante o registro
3. Clique em "Entrar"

### Navegação
- Após o login, você será redirecionado automaticamente para o painel administrativo
- Todas as páginas administrativas agora requerem autenticação
- O botão "Voltar" nas páginas administrativas leva ao painel principal

### Logout
1. No painel administrativo, clique no botão "Sair"
2. Você será redirecionado para a página de login

## Credenciais

- **E-mail**: O e-mail cadastrado durante o registro
- **Senha**: A senha criada durante o registro

## Segurança

### Implementação Atual
- Validação de credenciais no lado do cliente
- Armazenamento de senha em texto plano no localStorage
- Validação de confirmação de senha
- Verificação de força de senha (mínimo 6 caracteres)
- Armazenamento de sessão em localStorage
- Proteção de páginas administrativas

### Recomendações para Produção
1. Implementar autenticação no lado do servidor
2. Utilizar hashing para senhas (bcrypt, scrypt, etc.)
3. Implementar tokens de sessão com expiração
4. Adicionar proteção contra ataques de força bruta
5. Utilizar HTTPS para comunicação segura
6. Implementar recuperação de senha segura

## Arquivos Modificados

### login.html
- Nova página de login com interface amigável
- Campo de e-mail em vez de nome de usuário
- Validação de credenciais contra e-mail e senha armazenados
- Mensagens de erro
- Redirecionamento automático para usuários já autenticados

### index.html
- Adicionados campos de senha e confirmação de senha no formulário de aquisição
- Validação de senha durante o processo de registro
- Armazenamento da senha no establishmentData
- Adicionados botões de login na seção hero e na mensagem de sucesso
- Modificada a função `goToAdmin()` para verificar autenticação
- Redirecionamento para login quando não autenticado

### admin.html
- Adicionada verificação de autenticação no carregamento da página
- Redirecionamento para login quando não autenticado

### qr-management.html
- Adicionada verificação de autenticação no carregamento da página
- Redirecionamento para login quando não autenticado

## Benefícios

- **Segurança**: Protege o acesso à área administrativa com autenticação por e-mail e senha personalizadas
- **Controle**: Garante que apenas usuários autorizados acessem o sistema
- **Experiência do Usuário**: Interface intuitiva e mensagens claras
- **Acesso Direto**: Botões de login facilitam o acesso à área administrativa
- **Validação**: Verificação de força de senha e confirmação
- **Consistência**: Sistema de autenticação unificado em toda a aplicação

## Testes Realizados

- Verificação do redirecionamento automático para usuários já autenticados
- Teste de validação de credenciais corretas e incorretas
- Confirmação do redirecionamento para login em páginas protegidas
- Validação do funcionamento do logout
- Teste dos botões de login na página inicial
- Validação de senha e confirmação de senha
- Verificação de requisitos mínimos de senha

## Considerações Finais

A implementação do sistema de login melhora significativamente a segurança do sistema, protegendo o acesso à área administrativa com autenticação por e-mail e senhas personalizadas. Embora a implementação atual seja baseada em cliente e armazene senhas em texto plano, ela estabelece a base para uma implementação mais robusta no futuro.