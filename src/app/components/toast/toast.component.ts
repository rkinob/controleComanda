import { Component, OnInit } from '@angular/core';
import { NotificacaoService } from '../../services/notificacao.service';

@Component({
  selector: 'app-toast',
  templateUrl: './toast.component.html',
  styleUrls: ['./toast.component.css']
})
export class ToastComponent implements OnInit {
  mensagem: string | null = null;

  constructor(private notificacaoService: NotificacaoService) { }

  ngOnInit(): void {
    this.notificacaoService.getMensagem().subscribe(msg => {
      this.mensagem = msg;
    });
  }
}
