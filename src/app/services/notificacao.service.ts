import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NotificacaoService {
  private mensagemSubject = new BehaviorSubject<string | null>(null);

  getMensagem(): Observable<string | null> {
    return this.mensagemSubject.asObservable();
  }

  mostrar(mensagem: string, duracao: number = 2500): void {
    this.mensagemSubject.next(mensagem);
    setTimeout(() => {
      this.mensagemSubject.next(null);
    }, duracao);
  }
}
