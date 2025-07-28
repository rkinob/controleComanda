import { Injectable } from '@angular/core';
import { Usuario } from  '../services/auth.service';
import { jwtDecode } from "jwt-decode";


@Injectable({
    providedIn: 'root'
  })

export class sessionStorageUtils {


    public obterUsuario(): Usuario {
        let usuario = new Usuario();
        let token = this.obterTokenUsuario();

        if (token) {
            let decoded = jwtDecode<Usuario>(token);
            usuario = decoded;
        }

        return usuario;
    }

    public obterTokenUsuario(): string {
        return sessionStorage.getItem('usuario-token')??'';
    }

    public salvarTokenUsuario(token: string) {
        sessionStorage.setItem('usuario-token', token);
    }

    public usuarioEstaLogado(): boolean {
      const currentUser = this.obterUsuario();

      if (!currentUser) {

          return false;
      }

      if (!this.isTokenExpired()) {

          return true;

      }


      return false;
  }

    public salvarUsuario(user: string) {
        sessionStorage.setItem('usuario-autenticado', JSON.stringify(user));
    }

    public getTokenExpirationDate(token: string): Date|null {
        const decoded = jwtDecode<any>(token);

        if (decoded.exp === undefined) return null;

        const date = new Date(0);
        date.setUTCSeconds(decoded.exp);
        return date;
    }

    public isTokenExpired(token?: string): boolean {
        if (!token) token = this.obterTokenUsuario();
        if (!token) return true;

        const date = this.getTokenExpirationDate(token);
        if (date === undefined || date === null) return false;
        return !(date.valueOf() > new Date().valueOf());
    }

    public limpar_sessao() {
        sessionStorage.clear();
        sessionStorage.clear();
    }
}
