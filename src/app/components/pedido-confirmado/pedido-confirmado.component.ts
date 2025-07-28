import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CarrinhoService } from '../../services/carrinho.service';
import { ComandaService } from 'src/app/services/comanda.service';
import { Subscription } from 'rxjs';
import { NotificacaoService } from 'src/app/services/notificacao.service';

@Component({
  selector: 'app-pedido-confirmado',
  templateUrl: './pedido-confirmado.component.html',
  styleUrls: ['./pedido-confirmado.component.css']
})
export class PedidoConfirmadoComponent implements OnInit, OnDestroy {
  comandaId: number = 1; // Exemplo: atribua o ID real da comanda aberta
  subscription: Subscription = new Subscription();
  constructor(
    private router: Router,
    private carrinhoService: CarrinhoService,
    private comandaService: ComandaService,
    private notificacaoService: NotificacaoService
  ) {}

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
  fecharComanda(): void {
   //confirmar a ação de fechar a comanda
   if (confirm('Tem certeza que deseja fechar a comanda?')) {
    const comandaStr = sessionStorage.getItem('comanda');

    if (comandaStr) {
      try {
        const comandaObj = JSON.parse(comandaStr);
        this.comandaId = comandaObj.comanda_id || comandaObj.id || 1;
      } catch (e) {
        this.comandaId = 1;
      }
    }

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

  continuarPedindo(): void {
    this.router.navigate(['/categorias']);
  }
}
