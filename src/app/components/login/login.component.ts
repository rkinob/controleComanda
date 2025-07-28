import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ComandaService } from '../../services/comanda.service';

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
    private comandaService: ComandaService
  ) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      mesa: ['', Validators.required],
      nome: ['', Validators.required],
      celular: ['', [Validators.required, Validators.pattern(/^[0-9]{9,15}$/)]],
    });

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
              sessionStorage.setItem('comanda', JSON.stringify(comandaRes));
              this.router.navigate(['/categorias'], { queryParams: dados });
            } else {
              this.mensagem = 'Erro ao abrir comanda.';
            }
          });
        } else {
          this.mensagem = 'Falha na autenticação.';
        }
      }, err => {
        this.mensagem = 'Erro de comunicação com o servidor.';
      });
    } else {
      this.loginForm.markAllAsTouched();
      this.mensagem = 'Preencha todos os campos corretamente.';
    }
  }
}
