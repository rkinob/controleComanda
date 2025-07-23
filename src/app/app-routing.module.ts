import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { CategoriasComponent } from './components/categorias/categorias.component';
import { ProdutosComponent } from './components/produtos/produtos.component';
import { CarrinhoComponent } from './components/carrinho/carrinho.component';
import { PedidoConfirmadoComponent } from './components/pedido-confirmado/pedido-confirmado.component';
import { ComandaComponent } from './components/comanda/comanda.component';

const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'categorias', component: CategoriasComponent },
  { path: 'produtos', redirectTo: '/categorias', pathMatch: 'full' },
  { path: 'produtos/:categoria', component: ProdutosComponent },
  { path: 'carrinho', component: CarrinhoComponent },
  { path: 'pedido-confirmado', component: PedidoConfirmadoComponent },
  { path: 'comanda', component: ComandaComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
