import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { ItemCarrinho } from './carrinho.service';
import { sessionStorageUtils } from '../utils/sessionStorage';
import { BaseService } from './base.service';

export interface Comanda {
  id: number;
  mesa: number;
  usuario_id: number;
  status: string;
  aberta_em?: string;
  fechada_em?: string;
}

export interface Pedido {
  id: number;
  comanda_id: number;
  quantidade: number;
  preco: string;
  status: string;
  itens: ItemCarrinho[];
}

@Injectable({
  providedIn: 'root'
})
export class ComandaService extends BaseService {
  private apiUrl = this.urlServiceV1;
  public pedidos: Pedido[] = [];
  public pedidosSubject = new BehaviorSubject<Pedido[]>(this.pedidos);


  constructor(private http: HttpClient) {
    super();
   }


  registrarPedido(comandaId: number, itens: ItemCarrinho[]): Observable<any> {
    // Envia todos os itens em um único pedido
    const pedidos = itens.map(item => ({
      comanda_id: comandaId,
      produto_id: item.produto.id,
      quantidade: item.quantidade,
      observacao: item.produto.observacao || ''
    }));
    // Envia o array completo de itens
    return this.http.post(`${this.apiUrl}/pedidos.php`, pedidos, this.ObterAuthHeaderJson());
  }

  getComandas(): Observable<Comanda[]> {
    return this.http.get<Comanda[]>(`${this.apiUrl}/comandas.php`,  this.ObterAuthHeaderJson() );
  }

  abrirComanda(mesa: number, usuario_id: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/comandas.php`, { mesa, usuario_id }, this.ObterAuthHeaderJson());
  }

  fecharComanda(id: number): Observable<any> {
    return this.http.put(`${this.apiUrl}/comandas.php`, { id }, this.ObterAuthHeaderJson());
  }

  getPedidos(comandaId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/pedidos.php?comanda_id=${comandaId}`, this.ObterAuthHeaderJson());
  }
}
