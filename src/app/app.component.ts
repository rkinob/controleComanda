import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'restaurante-pedido';

  constructor(private router: Router) {}

  isLoginRoute(): boolean {
    return this.router.url.startsWith('/login');
  }
}
