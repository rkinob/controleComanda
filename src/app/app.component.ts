import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CarrinhoService } from './services/carrinho.service';
import { Subscription } from 'rxjs';
import { NotificacaoService } from './services/notificacao.service';
import { ComandaService } from './services/comanda.service';
import { PushNotificationService } from './services/push-notification.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'restaurante-pedido';
  quantidadeItens: number = 0;
  quantidadeNotificacoes: number = 0;
  quantidadeComandas: number = 0;
  subscription: Subscription = new Subscription();
  subscription2: Subscription = new Subscription();
  comandaId: number = 0;
  constructor(private router: Router, private carrinhoService: CarrinhoService, private notificacaoService: NotificacaoService,
    private comandaService: ComandaService,
    private pushNotificationService: PushNotificationService
  ) {}

  getQuantidadeItens()  {
    this.quantidadeItens = 0;
    this.subscription = this.carrinhoService.getItens().subscribe(itens => {
      this.quantidadeItens = itens.length;
    });
  }

  getQuantidadeComandas() {
    //pega o id da comanda aberta
    const comandaId = sessionStorage.getItem('comanda');
    if (comandaId) {
      this.comandaId = parseInt(comandaId);
    }
    this.quantidadeComandas = 0;
    this.subscription2 = this.comandaService.pedidosSubject.subscribe(pedidos => {
      this.quantidadeComandas = pedidos.length;
    });
  }
  ngOnInit(): void {
    this.getQuantidadeItens();
    this.getQuantidadeComandas();
    this.pushNotificationService.getNotifications().subscribe(notifications => {
      this.quantidadeNotificacoes = notifications.length;
      //atualizar página
      //this.router.navigate(['/'], { queryParams: { notificacoes: this.quantidadeNotificacoes } });
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
    this.subscription2.unsubscribe();
  }
  isLoginRoute(): boolean {
    return this.router.url.startsWith('/login');
  }
}
