import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CarrinhoService } from '../../services/carrinho.service';

@Component({
  selector: 'app-pedido-confirmado',
  templateUrl: './pedido-confirmado.component.html',
  styleUrls: ['./pedido-confirmado.component.css']
})
export class PedidoConfirmadoComponent {
  constructor(
    private router: Router,
    private carrinhoService: CarrinhoService
  ) {}

  fecharComanda(): void {
    this.carrinhoService.limparCarrinho();
    this.router.navigate(['/login']);
  }

  continuarPedindo(): void {
    this.router.navigate(['/categorias']);
  }
}
