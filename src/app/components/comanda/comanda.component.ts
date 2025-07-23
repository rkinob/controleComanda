import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ComandaService } from '../../services/comanda.service';
import { CarrinhoService, ItemCarrinho } from '../../services/carrinho.service';

@Component({
  selector: 'app-comanda',
  templateUrl: './comanda.component.html',
  styleUrls: ['./comanda.component.css']
})
export class ComandaComponent {
  historico: ItemCarrinho[][] = [];

  constructor(
    private comandaService: ComandaService,
    private carrinhoService: CarrinhoService,
    private router: Router
  ) {
    this.historico = this.comandaService.getHistorico();
  }

  fecharComanda(): void {
    this.comandaService.limparComanda();
    this.carrinhoService.limparCarrinho();
    this.router.navigate(['/login']);
  }

  continuarComprando(): void {
    this.router.navigate(['/produtos']);
  }
}
