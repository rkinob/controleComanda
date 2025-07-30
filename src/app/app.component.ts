import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CarrinhoService } from './services/carrinho.service';
import { Subscription } from 'rxjs';
import { NotificacaoService } from './services/notificacao.service';
import { ComandaService } from './services/comanda.service';
import { PushNotificationService, Notification } from './services/push-notification.service';

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
  comandaId: number = 0;
  unsubscribes: Subscription[] = [];

  constructor(
    private router: Router,
    private carrinhoService: CarrinhoService,
    private notificacaoService: NotificacaoService,
    private comandaService: ComandaService,
    private pushNotificationService: PushNotificationService
  ) {}

  getQuantidadeItens()  {
    this.quantidadeItens = 0;
    this.unsubscribes.push(this.carrinhoService.getItens().subscribe(itens => {
      this.quantidadeItens = itens.length;
    }));
  }

  getQuantidadeComandas() {
    //pega o id da comanda aberta
    const comandaData = sessionStorage.getItem('comanda');
    if (comandaData) {
      try {
        const comanda = JSON.parse(comandaData);
        this.comandaId = comanda.comanda_id || 0;
      } catch (e) {
        this.comandaId = 0;
      }
    }
    this.quantidadeComandas = 0;
    this.unsubscribes.push(this.comandaService.pedidosSubject.subscribe(pedidos => {
     // console.log(pedidos);
      this.quantidadeComandas = pedidos.length;
    }));
  }

  // Processamento global de cancelamentos
  private processarCancelamentosGlobais() {
    this.unsubscribes.push(this.pushNotificationService.getCancellationNotifications().subscribe(notifications => {
      if (notifications.length > 0) {
        console.log(`[App] Processando ${notifications.length} notificação(ões) de cancelamento global`);

        notifications.forEach(notificacao => {
          if (notificacao.pedido_id) {
            this.processarCancelamentoIndividual(notificacao.pedido_id);
          }
        });

        // Sincroniza com o backend após processar todos os cancelamentos
        setTimeout(() => {
          this.sincronizarPedidosComBackend();
        }, 1000);
      }
    }));
  }

  // Processa um cancelamento individual
  private processarCancelamentoIndividual(pedidoId: number): void {
    console.log(`[App] Processando cancelamento do pedido #${pedidoId}`);

    // Remove o pedido da lista global de pedidos
    const pedidosAtuais = this.comandaService.pedidosSubject.value;
    const pedidoIndex = pedidosAtuais.findIndex(pedido => pedido.id === pedidoId);

    if (pedidoIndex !== -1) {
      const pedidoRemovido = pedidosAtuais[pedidoIndex];
      pedidosAtuais.splice(pedidoIndex, 1);

      // Atualiza a lista global
      this.comandaService.pedidosSubject.next([...pedidosAtuais]);

      console.log(`[App] Pedido #${pedidoId} removido da lista global por cancelamento`);

      // Mostra notificação para o usuário
      this.notificacaoService.mostrar(`Pedido #${pedidoId} foi cancelado e removido da lista.`, 3000);
    } else {
      console.log(`[App] Pedido #${pedidoId} não encontrado na lista global para remoção`);
    }
  }

  // Sincroniza a lista global com o backend
  private sincronizarPedidosComBackend(): void {
    if (this.comandaId > 0) {
      this.comandaService.getPedidos(this.comandaId).subscribe(pedidos => {
        const pedidosAtivos = pedidos.filter(pedido => pedido.status !== 'cancelado');
        const pedidosAtuais = this.comandaService.pedidosSubject.value;

        // Atualiza apenas se houver diferenças
        if (JSON.stringify(pedidosAtuais) !== JSON.stringify(pedidosAtivos)) {
          this.comandaService.pedidosSubject.next(pedidosAtivos);
          console.log('[App] Lista global sincronizada com o backend');
        }
      });
    }
  }

  ngOnInit(): void {
    this.getQuantidadeItens();
    this.getQuantidadeComandas();

    // Processamento de notificações gerais
    this.unsubscribes.push(this.pushNotificationService.getNotifications().subscribe(notifications => {
      this.quantidadeNotificacoes = notifications.length;
    }));

    // Processamento global de cancelamentos
    this.processarCancelamentosGlobais();
  }

  ngOnDestroy(): void {
    this.unsubscribes.forEach(unsubscribe => unsubscribe.unsubscribe());
  }

  isLoginRoute(): boolean {
    return this.router.url.startsWith('/login');
  }
}
