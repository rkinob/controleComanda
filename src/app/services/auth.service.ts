import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';

export class Usuario {
  id!: number;
  nome!: string;
  celular!: string;
  mesa!: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost/restaurante';
  private usuarioSubject = new BehaviorSubject<Usuario | null>(null);

  usuario$ = this.usuarioSubject.asObservable();

  constructor(private http: HttpClient) {
    const usuario = localStorage.getItem('usuario');
    if (usuario) {
      this.usuarioSubject.next(JSON.parse(usuario));
    }
  }

  login(celular: string, mesa: string, nome: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/login.php`, { celular, mesa, nome }).pipe(
      tap(res => {
        if (res.sucesso && res.usuario) {
          this.usuarioSubject.next(res.usuario);
          localStorage.setItem('usuario', JSON.stringify(res.usuario));
        }
      })
    );
  }

  logout(): void {
    this.usuarioSubject.next(null);
    localStorage.removeItem('usuario');
  }

  get usuarioAtual(): Usuario | null {
    return this.usuarioSubject.value;
  }

  estaLogado(): boolean {
    return !!this.usuarioSubject.value;
  }
}
