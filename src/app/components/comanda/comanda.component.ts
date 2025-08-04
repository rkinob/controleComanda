import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ComandaService } from '../../services/comanda.service';
import { CarrinhoService, ItemCarrinho } from '../../services/carrinho.service';
import { Produto } from 'src/app/services/produto.service';
import { NotificacaoService } from '../../services/notificacao.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-comanda',
  templateUrl: './comanda.component.html',
  styleUrls: ['./comanda.component.css']
})
export class ComandaComponent implements OnInit, OnDestroy {
  comandaId: number = 1; // Exemplo: atribua o ID real da comanda aberta
  historico: any[] = [];
  subscription: Subscription = new Subscription();

  constructor(
    private comandaService: ComandaService,
    private carrinhoService: CarrinhoService,
    private router: Router,
    private notificacaoService: NotificacaoService
  ) {}

  ngOnInit(): void {
    // Recupera o número da comanda do sessionStorage
    const comandaStr = sessionStorage.getItem('comanda');

    if (comandaStr) {
      try {
        const comandaObj = JSON.parse(comandaStr);
        this.comandaId = comandaObj.comanda_id || comandaObj.id || 1;
      } catch (e) {
        this.comandaId = 1;
      }
    }

    // Carrega os pedidos iniciais
    this.carregarPedidos();

    // Inscreve para receber atualizações da lista global de pedidos
    this.subscription.add(
      this.comandaService.pedidosSubject.subscribe(pedidos => {
        this.historico = pedidos;
      })
    );
  }

  getImagemProduto(produto: Produto): string {
    return `assets/${produto.id}.jpg`;
  }

  onImagemErro(event: Event): void {
    const target = event.target as HTMLImageElement;
    target.src = 'assets/image_large.gif';
  }

  // Carrega os pedidos da comanda
  private carregarPedidos(): void {
    this.comandaService.getPedidos(this.comandaId).subscribe(pedidos => {
      // Filtra apenas pedidos que não estão cancelados
      const pedidosAtivos = pedidos.filter(pedido => pedido.status !== 'cancelado');
      this.historico = pedidosAtivos;

      // Atualiza a lista global no serviço
      this.comandaService.pedidosSubject.next(pedidosAtivos);
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  // Retorna a classe CSS baseada no status do pedido
  getStatusClass(status: string): string {
    switch (status?.toLowerCase()) {
      case 'entregue':
        return 'status-entregue';
      case 'preparando':
        return 'status-preparando';
      case 'confirmado':
        return 'status-confirmado';
      case 'cancelado':
        return 'status-cancelado';
      default:
        return 'status-pendente';
    }
  }

  // Retorna o texto formatado do status
  getStatusText(status: string): string {
    switch (status?.toLowerCase()) {
      case 'entregue':
        return '✅ Entregue';
      case 'preparando':
        return '👨‍🍳 Preparando';
      case 'confirmado':
        return '✅ Confirmado';
      case 'cancelado':
        return '❌ Cancelado';
      default:
        return '⏳ Pendente';
    }
  }

  fecharComanda(): void {
    //confirmar a ação de fechar a comanda
    if (confirm('Tem certeza que deseja fechar a comanda?')) {
      this.subscription = this.comandaService.fecharComanda(this.comandaId).subscribe({
        next: (response) => {
          // Mostra mensagem de sucesso
          this.notificacaoService.mostrar('Comanda fechada com sucesso!', 2000);
          // Limpa o carrinho e dados da sessão
          this.carrinhoService.limparCarrinho();

          // Aguarda um pouco para mostrar a mensagem antes de redirecionar
          setTimeout(() => {
            sessionStorage.removeItem('comanda');
            sessionStorage.removeItem('usuario-token');
            sessionStorage.removeItem('pedidos');
            this.comandaService.pedidosSubject.next([]);
            this.router.navigate(['/login']);
          }, 1500);
        },
        error: (error) => {
          console.error('Erro ao fechar comanda:', error);
          this.notificacaoService.mostrar('Erro ao fechar comanda. Tente novamente.', 2000);
        }
      });
    }
  }

  continuarComprando(): void {
    this.router.navigate(['/produtos']);
  }

  // Método de teste para remoção manual (pode ser removido em produção)
  testarRemocaoCancelamento(): void {
    if (this.historico.length > 0) {
      const primeiroPedido = this.historico[0];
      console.log(`[Comanda] Testando remoção manual do pedido #${primeiroPedido.id}`);

      // Simula a remoção de um pedido cancelado
      this.historico.splice(0, 1);
      this.comandaService.pedidosSubject.next([...this.historico]);

      this.notificacaoService.mostrar(`Pedido #${primeiroPedido.id} removido manualmente (teste)`, 2000);
    } else {
      this.notificacaoService.mostrar('Nenhum pedido para testar remoção', 2000);
    }
  }
}
