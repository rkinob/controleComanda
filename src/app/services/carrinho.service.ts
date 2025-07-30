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
  // itens do carrinho armazenados no sessionStorage
  private itensCarrinho: ItemCarrinho[] = JSON.parse(sessionStorage.getItem('carrinho') || '[]');
    private carrinhoSubject = new BehaviorSubject<ItemCarrinho[]>(this.itensCarrinho);

  constructor() {
    this.carrinhoSubject.next(this.itensCarrinho);
  }

  getItens(): Observable<ItemCarrinho[]> {
    return this.carrinhoSubject.asObservable();
  }

  adicionarItem(produto: Produto): boolean {
    const itemExistente = this.itensCarrinho.find(item => item.produto.id === produto.id);

    if (itemExistente) {
      //itemExistente.quantidade += 1;
      return false;
    } else {
      this.itensCarrinho.push({ produto, quantidade: 1 });

    }
    sessionStorage.setItem('carrinho', JSON.stringify(this.itensCarrinho));
    this.carrinhoSubject.next([...this.itensCarrinho]);
    return true;

  }

  removerItem(produtoId: number): void {
    this.itensCarrinho = this.itensCarrinho.filter(item => item.produto.id !== produtoId);
    sessionStorage.setItem('carrinho', JSON.stringify(this.itensCarrinho));
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
    sessionStorage.setItem('carrinho', JSON.stringify(this.itensCarrinho));
  }

  atualizarObservacao(produtoId: number, observacao: string): void {
    const item = this.itensCarrinho.find(item => item.produto.id === produtoId);

    if (item) {
      item.produto.observacao = observacao;
      sessionStorage.setItem('carrinho', JSON.stringify(this.itensCarrinho));
      this.carrinhoSubject.next([...this.itensCarrinho]);
    }
  }

  limparCarrinho(): void {
    this.itensCarrinho = [];
    this.carrinhoSubject.next([]);
    sessionStorage.removeItem('carrinho');
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
