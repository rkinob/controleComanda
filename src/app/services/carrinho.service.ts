import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Produto } from './produto.service';

export interface ItemCarrinho {
  produto: Produto;
  quantidade: number;
}

@Injectable({
  providedIn: 'root'
})
export class CarrinhoService {
  private itensCarrinho: ItemCarrinho[] = [];
  private carrinhoSubject = new BehaviorSubject<ItemCarrinho[]>([]);

  constructor() { }

  getItens(): Observable<ItemCarrinho[]> {
    return this.carrinhoSubject.asObservable();
  }

  adicionarItem(produto: Produto): void {
    const itemExistente = this.itensCarrinho.find(item => item.produto.id === produto.id);

    if (itemExistente) {
      itemExistente.quantidade += 1;
    } else {
      this.itensCarrinho.push({ produto, quantidade: 1 });
    }

    this.carrinhoSubject.next([...this.itensCarrinho]);
  }

  removerItem(produtoId: number): void {
    this.itensCarrinho = this.itensCarrinho.filter(item => item.produto.id !== produtoId);
    this.carrinhoSubject.next([...this.itensCarrinho]);
  }

  alterarQuantidade(produtoId: number, quantidade: number): void {
    const item = this.itensCarrinho.find(item => item.produto.id === produtoId);

    if (item) {
      if (quantidade <= 0) {
        this.removerItem(produtoId);
      } else {
        item.quantidade = quantidade;
        this.carrinhoSubject.next([...this.itensCarrinho]);
      }
    }
  }

  limparCarrinho(): void {
    this.itensCarrinho = [];
    this.carrinhoSubject.next([]);
  }

  getTotal(): number {
    return this.itensCarrinho.reduce((total, item) => {
      return total + (item.produto.preco * item.quantidade);
    }, 0);
  }

  getQuantidadeItens(): number {
    return this.itensCarrinho.reduce((total, item) => total + item.quantidade, 0);
  }
}
