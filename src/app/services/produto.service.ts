import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

export interface Produto {
  id: number;
  nome: string;
  descricao: string;
  preco: number;
  categoria: string;
  imagem?: string;
  observacao?: string; // Observação do cliente
}

export interface Categoria {
  id: string;
  nome: string;
  icone: string;
  descricao: string;
}

@Injectable({
  providedIn: 'root'
})
export class ProdutoService {

  private categorias: Categoria[] = [
    {
      id: 'lanches',
      nome: 'Lanches',
      icone: '🍔',
      descricao: 'Hambúrgueres, sanduíches e outros lanches'
    },
    {
      id: 'bebidas',
      nome: 'Bebidas',
      icone: '🥤',
      descricao: 'Refrigerantes, sucos e outras bebidas'
    },
    {
      id: 'porcoes',
      nome: 'Porções',
      icone: '🍟',
      descricao: 'Porções de batata, frango e outros petiscos'
    }
  ];

  private produtos: Produto[] = [
    // Lanches
    { id: 1, nome: 'X-Burger', descricao: 'Hambúrguer com queijo, alface e tomate', preco: 15.90, categoria: 'lanches', imagem: '🍔' },
    { id: 2, nome: 'X-Salada', descricao: 'Hambúrguer com queijo, alface, tomate e maionese', preco: 18.90, categoria: 'lanches', imagem: '🥗' },
    { id: 3, nome: 'X-Bacon', descricao: 'Hambúrguer com queijo, bacon e molho especial', preco: 22.90, categoria: 'lanches', imagem: '🥓' },
    { id: 4, nome: 'Sanduíche Natural', descricao: 'Pão integral com frango, alface e tomate', preco: 12.90, categoria: 'lanches', imagem: '🥪' },

    // Bebidas
    { id: 5, nome: 'Coca-Cola', descricao: 'Refrigerante Coca-Cola 350ml', preco: 6.90, categoria: 'bebidas', imagem: '🥤' },
    { id: 6, nome: 'Suco de Laranja', descricao: 'Suco natural de laranja 300ml', preco: 8.90, categoria: 'bebidas', imagem: '🍊' },
    { id: 7, nome: 'Água Mineral', descricao: 'Água mineral sem gás 500ml', preco: 4.90, categoria: 'bebidas', imagem: '💧' },
    { id: 8, nome: 'Milk Shake', descricao: 'Milk shake de chocolate, morango ou baunilha', preco: 12.90, categoria: 'bebidas', imagem: '🥛' },

    // Porções
    { id: 9, nome: 'Batata Frita', descricao: 'Porção de batata frita crocante', preco: 16.90, categoria: 'porcoes', imagem: '🍟' },
    { id: 10, nome: 'Frango à Passarinho', descricao: 'Porção de frango empanado e frito', preco: 24.90, categoria: 'porcoes', imagem: '🍗' },
    { id: 11, nome: 'Mandioca Frita', descricao: 'Porção de mandioca frita com sal', preco: 14.90, categoria: 'porcoes', imagem: '🥔' },
    { id: 12, nome: 'Cebola Empanada', descricao: 'Porção de cebola empanada e frita', preco: 13.90, categoria: 'porcoes', imagem: '🧅' }
  ];

  constructor() { }

  getCategorias(): Observable<Categoria[]> {
    return of(this.categorias);
  }

  getProdutosPorCategoria(categoria: string): Observable<Produto[]> {
    const produtosFiltrados = this.produtos.filter(produto => produto.categoria === categoria);
    return of(produtosFiltrados);
  }

  getProdutoPorId(id: number): Observable<Produto | undefined> {
    const produto = this.produtos.find(p => p.id === id);
    return of(produto);
  }
}
