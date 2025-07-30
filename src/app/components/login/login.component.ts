import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ComandaService } from '../../services/comanda.service';
import { NotificacaoService } from 'src/app/services/notificacao.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  mensagem: string = '';

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService,
    private comandaService: ComandaService,
    private notificacaoService: NotificacaoService
  ) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      mesa: ['', Validators.required],
      nome: ['', Validators.required],
      celular: ['', [Validators.required, Validators.pattern(/^[0-9]{9,15}$/)]],
    });

    this.comandaService.pedidosSubject.next([]);
    sessionStorage.removeItem('comanda');
    sessionStorage.removeItem('pedidos');
    sessionStorage.removeItem('usuario-token');

    // Preencher o campo mesa a partir do parâmetro da URL
    this.route.queryParams.subscribe(params => {
      if (params['mesa']) {
        this.loginForm.patchValue({ mesa: params['mesa'] });
      }
    });
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      const dados = this.loginForm.getRawValue();
      // Chama o endpoint de autenticação

      this.authService.login(dados.celular, dados.mesa, dados.nome).subscribe(res => {
        if (res.sucesso && res.token) {
          sessionStorage.setItem('usuario-token', res.token);

          // Cria nova comanda após autenticação
          this.comandaService.abrirComanda(Number(dados.mesa), res.usuario.id).subscribe(comandaRes => {
            if (comandaRes.sucesso && comandaRes.comanda_id) {
              console.log(comandaRes);
              sessionStorage.setItem('comanda', JSON.stringify(comandaRes));

              this.router.navigate(['/categorias']);
            } else {
              this.notificacaoService.mostrar('Erro ao abrir comanda.', 3000);
            }
          });
        } else {
          this.notificacaoService.mostrar(res.erro, 3000);
        }
      }, err => {
        this.notificacaoService.mostrar(err.error.erro, 3000);
      });
    } else {
      this.loginForm.markAllAsTouched();
      this.notificacaoService.mostrar('Preencha todos os campos corretamente.', 3000);
    }
  }
}
