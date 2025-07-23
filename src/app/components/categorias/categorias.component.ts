import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Categoria, ProdutoService } from '../../services/produto.service';

@Component({
  selector: 'app-categorias',
  templateUrl: './categorias.component.html',
  styleUrls: ['./categorias.component.css']
})
export class CategoriasComponent implements OnInit {
  categorias: Categoria[] = [];

  constructor(
    private produtoService: ProdutoService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.carregarCategorias();
  }

  carregarCategorias(): void {
    this.produtoService.getCategorias().subscribe(categorias => {
      this.categorias = categorias;
    });
  }

  selecionarCategoria(categoria: Categoria): void {
    this.router.navigate(['/produtos', categoria.id]);
  }
}
