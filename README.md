# 🍽️ Sistema de Pedidos - Frontend Angular

Interface moderna para sistema de pedidos de restaurante desenvolvida em Angular.

## 📋 Índice

- [Funcionalidades](#funcionalidades)
- [Tecnologias Utilizadas](#tecnologias-utilizadas)
- [Pré-requisitos](#pré-requisitos)
- [Instalação](#instalação)
- [Como Usar](#como-usar)
- [Estrutura do Projeto](#estrutura-do-projeto)

## ✨ Funcionalidades

- **🔐 Sistema de Login**: Autenticação com JWT
- **🛒 Carrinho de Compras**: Adicionar, remover e gerenciar itens
- **📋 Histórico de Pedidos**: Visualizar pedidos realizados
- **🔔 Notificações em Tempo Real**: Atualizações automáticas de status
- **📊 Gestão de Produtos**: Categorias e produtos organizados
- **💳 Controle de Comandas**: Sistema completo de comandas

## 🛠️ Tecnologias Utilizadas

- **Angular 15+**: Framework principal
- **TypeScript**: Linguagem de programação
- **CSS3**: Estilização moderna com gradientes e efeitos
- **HTML5**: Estrutura semântica
- **RxJS**: Programação reativa
- **Angular Services**: Gerenciamento de estado e comunicação com API

## 📋 Pré-requisitos

- **Node.js** (versão 16 ou superior)
- **npm** ou **yarn**
- **Angular CLI** (versão 15 ou superior)

## 🚀 Instalação

### 1. Clone o Repositório

```bash
git clone https://github.com/seu-usuario/restaurante-pedido.git
cd restaurante-pedido
```

### 2. Instale as Dependências

```bash
npm install
```

### 3. Configure o Ambiente

Edite `src/environments/environment.ts`:

```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost/restaurante/'
};
```


## 🎯 Como Usar

### 1. Iniciar o Desenvolvimento

```bash
# Inicie o servidor de desenvolvimento
ng serve

# Acesse http://localhost:4200
```

### 2. Fluxo de Uso do Sistema

#### **Login**
1. Acesse a aplicação em `http://localhost:4200`
2. Digite suas credenciais no formulário de login
3. O sistema autentica e redireciona para as categorias

#### **Fazer um Pedido**
1. **Selecione uma Categoria**: Escolha entre as categorias disponíveis
2. **Escolha os Produtos**: Clique nos produtos desejados
3. **Adicione ao Carrinho**: Use o botão "+" para adicionar itens
4. **Adicione Observações**: (Opcional) Digite observações especiais
5. **Confirme o Pedido**: Revise e confirme seu pedido

#### **Gerenciar Pedidos**
1. **Visualizar Carrinho**: Acesse o ícone do carrinho no header
2. **Editar Quantidades**: Ajuste as quantidades dos itens
3. **Remover Itens**: Use o botão "-" para remover
4. **Finalizar Pedido**: Confirme para enviar ao restaurante

#### **Acompanhar Pedidos**
1. **Histórico**: Acesse a aba "Comanda"
2. **Status em Tempo Real**: Veja atualizações automáticas
3. **Notificações**: Receba alertas de mudanças de status

### 3. Funcionalidades Principais

#### **Carrinho de Compras**
- ✅ Adicionar/remover itens
- ✅ Ajustar quantidades
- ✅ Adicionar observações
- ✅ Cálculo automático de valores

#### **Sistema de Notificações**
- 🔔 Atualizações de status em tempo real
- 📱 Notificações push (se suportado)
- ⏰ Alertas automáticos

#### **Gestão de Comandas**
- 📋 Histórico completo de pedidos
- 📊 Status detalhado de cada pedido
- 💰 Controle de valores e pagamentos

## 📁 Estrutura do Projeto

```
src/
├── app/
│   ├── components/
│   │   ├── carrinho/              # Componente do carrinho
│   │   │   ├── carrinho.component.ts
│   │   │   ├── carrinho.component.html
│   │   │   └── carrinho.component.css
│   │   ├── categorias/            # Lista de categorias
│   │   │   ├── categorias.component.ts
│   │   │   ├── categorias.component.html
│   │   │   └── categorias.component.css
│   │   ├── comanda/               # Histórico de pedidos
│   │   │   ├── comanda.component.ts
│   │   │   ├── comanda.component.html
│   │   │   └── comanda.component.css
│   │   ├── login/                 # Tela de login
│   │   │   ├── login.component.ts
│   │   │   ├── login.component.html
│   │   │   └── login.component.css
│   │   ├── produtos/              # Lista de produtos
│   │   │   ├── produtos.component.ts
│   │   │   ├── produtos.component.html
│   │   │   └── produtos.component.css
│   │   ├── notification-bell/      # Sino de notificações
│   │   │   ├── notification-bell.component.ts
│   │   │   └── notification-bell.component.html
│   │   ├── pedido-confirmado/      # Confirmação de pedido
│   │   │   ├── pedido-confirmado.component.ts
│   │   │   ├── pedido-confirmado.component.html
│   │   │   └── pedido-confirmado.component.css
│   │   └── toast/                 # Notificações toast
│   │       ├── toast.component.ts
│   │       ├── toast.component.html
│   │       └── toast.component.css
│   ├── services/
│   │   ├── auth.service.ts        # Autenticação
│   │   ├── base.service.ts        # Serviço base para API
│   │   ├── carrinho.service.ts    # Gestão do carrinho
│   │   ├── comanda.service.ts     # Histórico de pedidos
│   │   ├── notificacao.service.ts # Notificações
│   │   ├── produto.service.ts     # Produtos e categorias
│   │   └── push-notification.service.ts # Push notifications
│   ├── utils/
│   │   └── sessionStorage.ts      # Gerenciamento de sessão
│   ├── app.component.ts           # Componente principal
│   ├── app.component.html         # Template principal
│   ├── app.component.css          # Estilos globais
│   ├── app.module.ts              # Módulo principal
│   └── app-routing.module.ts      # Configuração de rotas
├── assets/                        # Imagens e recursos
├── environments/                   # Configurações de ambiente
│   ├── environment.ts             # Desenvolvimento
│   └── environment.prod.ts        # Produção
├── index.html                     # HTML principal
├── main.ts                        # Ponto de entrada
└── styles.css                     # Estilos globais
```

### Estrutura dos Componentes

Cada componente segue a estrutura padrão do Angular:

```typescript
// nome.component.ts
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-nome',
  templateUrl: './nome.component.html',
  styleUrls: ['./nome.component.css']
})
export class NomeComponent implements OnInit {
  // Lógica do componente
}
```


### Roteamento

As rotas estão configuradas em `app-routing.module.ts`:

```typescript
const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'categorias', component: CategoriasComponent },
  { path: 'produtos/:categoria', component: ProdutosComponent },
  { path: 'carrinho', component: CarrinhoComponent },
  { path: 'comanda', component: ComandaComponent },
  { path: 'pedido-confirmado', component: PedidoConfirmadoComponent }
];
```


## 🚀 Deploy

### Build para Produção

```bash
# Build otimizado
ng build --prod

# Os arquivos ficam em dist/restaurante-pedido/
# Copie para seu servidor web
```




⭐ **Se este projeto te ajudou, considere dar uma estrela!**
