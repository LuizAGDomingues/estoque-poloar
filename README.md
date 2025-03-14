# Sistema de Gerenciamento de Estoque - PoloAr

Sistema web para gerenciar o estoque de máquinas de ar condicionado da PoloAr, permitindo exibir, cadastrar, editar e remover registros.

## Tecnologias Utilizadas

- **Frontend**: Next.js para criação de páginas e rotas dinâmicas
- **Estilização**: Tailwind CSS com cores personalizadas da PoloAr
- **Banco de Dados**: Supabase (PostgreSQL) para gerenciamento centralizado dos dados
- **Exportação de Dados**: Funcionalidades para exportar os registros em formatos XLSM e CSV

## Funcionalidades Principais

1. **Dashboard**: Visualização rápida de estatísticas e próximas entregas/retiradas
2. **Estoque**: Listagem completa de máquinas com filtros e ordenação
3. **Cadastro**: Formulário para adicionar novas máquinas ao estoque
4. **Exportação**: Geração de relatórios em formatos XLSM e CSV

## Configuração do Projeto

### Pré-requisitos

- Node.js 18.x ou superior
- NPM ou Yarn

### Instalação

1. Clone o repositório:
   ```bash
   git clone https://github.com/seu-usuario/estoque-poloar.git
   cd estoque-poloar
   ```

2. Instale as dependências:
   ```bash
   npm install
   # ou
   yarn install
   ```

3. Configure as variáveis de ambiente:
   Crie um arquivo `.env.local` na raiz do projeto com as seguintes variáveis:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-chave-anonima
   ```

4. Inicie o servidor de desenvolvimento:
   ```bash
   npm run dev
   # ou
   yarn dev
   ```

5. Acesse o sistema em `http://localhost:3000`

## Estrutura do Banco de Dados

O sistema utiliza uma tabela `estoque` no Supabase com os seguintes campos:

- `id`: Identificador único (gerado automaticamente)
- `modelo`: Modelo da máquina
- `quantidade`: Quantidade de unidades
- `codigo`: Código de identificação da máquina
- `consultor`: Nome do consultor responsável
- `cliente`: Nome do cliente
- `contato`: Informações de contato
- `data_entrega`: Data de entrega da máquina
- `quem_recebeu`: Pessoa que recebeu a máquina
- `previsao_retirada`: Data prevista para retirada
- `data_saida`: Data efetiva de saída
- `quem_entregou`: Pessoa que entregou a máquina
- `status`: Status atual ('Em estoque', 'Entregue', 'Retirado', 'Pendente')
- `obs`: Observações adicionais
- `created_at`: Data de criação do registro (gerado automaticamente)

## Licença

Este projeto é propriedade da PoloAr e seu uso é restrito aos funcionários e colaboradores autorizados.
