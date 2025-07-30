import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { ZXingScannerModule } from '@zxing/ngx-scanner';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CategoriasComponent } from './components/categorias/categorias.component';
import { ProdutosComponent } from './components/produtos/produtos.component';
import { CarrinhoComponent } from './components/carrinho/carrinho.component';
import { ToastComponent } from './components/toast/toast.component';
import { PedidoConfirmadoComponent } from './components/pedido-confirmado/pedido-confirmado.component';
import { ComandaComponent } from './components/comanda/comanda.component';
import { NotificationBellComponent } from './components/notification-bell/notification-bell.component';
import { HttpClientModule } from '@angular/common/http';
import { CurrencyBrPipe } from './pipes/currency-br.pipe';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    CategoriasComponent,
    ProdutosComponent,
    CarrinhoComponent,
    ToastComponent,
    PedidoConfirmadoComponent,
    ComandaComponent,
    NotificationBellComponent,
    CurrencyBrPipe
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ZXingScannerModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
