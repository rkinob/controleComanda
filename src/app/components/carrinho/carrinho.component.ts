import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CarrinhoService, ItemCarrinho } from '../../services/carrinho.service';
import { NotificacaoService } from '../../services/notificacao.service';
import { ComandaService } from '../../services/comanda.service';

@Component({
  selector: 'app-carrinho',
  templateUrl: './carrinho.component.html',
  styleUrls: ['./carrinho.component.css']
})
export class CarrinhoComponent implements OnInit {
  itens: ItemCarrinho[] = [];
  total: number = 0;
  comandaId: number = 1; // Exemplo: atribua o ID real da comanda aberta

  constructor(
    private carrinhoService: CarrinhoService,
    private router: Router,
    private notificacaoService: NotificacaoService,
    private comandaService: ComandaService
  ) { }

  ngOnInit(): void {
    this.carrinhoService.getItens().subscribe(itens => {
      this.itens = itens;
      this.total = this.carrinhoService.getTotal();
    });
  }

  alterarQuantidade(produtoId: number, novaQuantidade: number): void {
    this.carrinhoService.alterarQuantidade(produtoId, novaQuantidade);
  }

  removerItem(produtoId: number): void {
    this.carrinhoService.removerItem(produtoId);
    this.notificacaoService.mostrar('Produto removido do carrinho!');
  }

  limparCarrinho(): void {
    this.carrinhoService.limparCarrinho();
    this.notificacaoService.mostrar('Carrinho limpo!');
  }

  continuarComprando(): void {
    this.router.navigate(['/categorias']);
  }

  finalizarPedido(): void {
    const comandaStr = sessionStorage.getItem('comanda');
    if (comandaStr) {
      const comandaObj = JSON.parse(comandaStr);
      this.comandaId = comandaObj.comanda_id || comandaObj.id || 1;
    }

    this.comandaService.registrarPedido(this.comandaId, this.itens).subscribe((pedido) => {
      this.comandaService.pedidos.push({
        id: pedido.id,
        comanda_id: this.comandaId,
        quantidade: this.itens.length,
        preco: pedido.preco,
        status: 'Pendente',
        itens: this.itens
      });
      this.carrinhoService.limparCarrinho();
      this.comandaService.atualizarSessionStorage();
      this.router.navigate(['/pedido-confirmado']);
    });
  }

  getQuantidadeItens(): number {
    return this.carrinhoService.getQuantidadeItens();
  }
}
