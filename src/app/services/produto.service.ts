import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { BaseService } from './base.service';

export interface Produto {
  id: number;
  nome: string;
  descricao: string;
  preco: number;
  categoria_id: string;
  imagem?: string;
  observacao?: string;
}

export interface Categoria {
  id: number;
  nome: string;
  icone?: string;
  descricao?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ProdutoService extends BaseService {
  private apiUrl = this.urlServiceV1;

  constructor(private http: HttpClient) {
    super();
  }

  getCategorias(): Observable<Categoria[]> {
    return this.http.get<Categoria[]>(`${this.apiUrl}/categorias.php`, this.ObterAuthHeaderJson());
  }

  getProdutos(): Observable<Produto[]> {
    return this.http.get<Produto[]>(`${this.apiUrl}/produtos.php`, this.ObterAuthHeaderJson());
  }

  getProdutosPorCategoria(categoria: string): Observable<Produto[]> {
    // Busca todos e filtra no frontend, ou crie endpoint específico no backend
    return new Observable<Produto[]>(observer => {
      this.getProdutos().subscribe(produtos => {
        console.log(produtos);
        console.log(categoria);
        observer.next(produtos.filter(p => p.categoria_id === categoria));
        observer.complete();
      }, err => observer.error(err));
    });
  }

  getProdutoPorId(id: number): Observable<Produto | undefined> {
    return new Observable<Produto | undefined>(observer => {
      this.getProdutos().subscribe(produtos => {
        observer.next(produtos.find(p => p.id === id));
        observer.complete();
      }, err => observer.error(err));
    });
  }
}
