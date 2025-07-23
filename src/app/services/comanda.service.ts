import { Injectable } from '@angular/core';
import { ItemCarrinho } from './carrinho.service';

@Injectable({
  providedIn: 'root'
})
export class ComandaService {
  private historico: ItemCarrinho[][] = [];

  registrarPedido(itens: ItemCarrinho[]): void {
    if (itens.length > 0) {
      // Salva uma cópia dos itens do pedido
      this.historico.push(itens.map(item => ({ ...item })));
    }
  }

  getHistorico(): ItemCarrinho[][] {
    return this.historico;
  }

  limparComanda(): void {
    this.historico = [];
  }
}
