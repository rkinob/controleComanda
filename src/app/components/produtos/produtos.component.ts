import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Categoria, Produto, ProdutoService } from '../../services/produto.service';
import { CarrinhoService } from '../../services/carrinho.service';
import { NotificacaoService } from '../../services/notificacao.service';

@Component({
  selector: 'app-produtos',
  templateUrl: './produtos.component.html',
  styleUrls: ['./produtos.component.css']
})
export class ProdutosComponent implements OnInit {
  produtos: Produto[] = [];
  categoriaAtual: string = '';
  categoriaNome: string = '';
  loading: boolean = true;
  categorias: Categoria[] = [];
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private produtoService: ProdutoService,
    private carrinhoService: CarrinhoService,
    private notificacaoService: NotificacaoService
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.categoriaAtual = params['categoria'];
      this.carregarProdutos();
      this.produtoService.getCategorias().subscribe(categorias => {
        this.categorias = categorias;
       const categoria = this.categorias.filter(c => c.id == parseInt(this.categoriaAtual));

        this.categoriaNome = categoria[0]?.nome || '';
      });
    });


  }

  carregarProdutos(): void {
    this.loading = true;
    this.produtoService.getProdutosPorCategoria(this.categoriaAtual).subscribe(produtos => {
     // console.log(produtos);
      this.produtos = produtos;

      //this.categoriaNome = this.getCategoriaNome(this.categoriaAtual);
      this.loading = false;
    });
  }



  adicionarAoCarrinho(produto: Produto): void {
   if(this.carrinhoService.adicionarItem(produto)) {
    this.notificacaoService.mostrar('Produto adicionado com sucesso!');
   } else {
    this.notificacaoService.mostrar('Produto já está no pedido! Aumente a quantidade ou remova o produto do pedido. ');
   }
  }

  voltarParaCategorias(): void {
    this.router.navigate(['/categorias']);
  }

  irParaCarrinho(): void {
    this.router.navigate(['/carrinho']);
  }

  getImagemProduto(produto: Produto): string {
    return `assets/${produto.id}.jpg`;
  }

  onImagemErro(event: Event): void {
    const target = event.target as HTMLImageElement;
    target.src = 'assets/image_large.gif';
  }
}
