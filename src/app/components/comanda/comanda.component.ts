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
  ) {

  }
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
    this.comandaService.getPedidos(this.comandaId).subscribe(pedidos => {
      this.historico = pedidos;
      /*console.log('Estrutura dos pedidos:', this.historico);
      if (this.historico.length > 0) {
        console.log('Primeiro pedido:', this.historico[0]);
        console.log('Tipo do primeiro pedido:', typeof this.historico[0]);
        console.log('É array?', Array.isArray(this.historico[0]));
      }*/
    });
  }
  getImagemProduto(produto: Produto): string {
    return `assets/${produto.id}.jpg`;
  }

  onImagemErro(event: Event): void {
    const target = event.target as HTMLImageElement;
    target.src = 'assets/image_large.gif';
  }
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
  fecharComanda(): void {
    //confirmar a ação de fechar a comanda
    if (confirm('Tem certeza que deseja fechar a comanda?')) {
   this.subscription = this.comandaService.fecharComanda(this.comandaId).subscribe({
      next: (response) => {
        // Mostra mensagem de sucesso
        this.notificacaoService.mostrar('Comanda fechada com sucesso!', 3000);
        // Limpa o carrinho e dados da sessão
        this.carrinhoService.limparCarrinho();
        sessionStorage.removeItem('comanda');
        sessionStorage.removeItem('usuario-token');

        // Aguarda um pouco para mostrar a mensagem antes de redirecionar
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 1500);
      },
      error: (error) => {
        console.error('Erro ao fechar comanda:', error);
        this.notificacaoService.mostrar('Erro ao fechar comanda. Tente novamente.', 3000);
          }
      });
    }
  }

  continuarComprando(): void {
    this.router.navigate(['/produtos']);
  }
}
