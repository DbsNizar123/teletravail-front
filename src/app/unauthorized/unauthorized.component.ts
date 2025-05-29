// src/app/unauthorized/unauthorized.component.ts
import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-unauthorized',
  template: `
    <div class="unauthorized-container">
      <h2>Accès non autorisé</h2>
      <p>Vous n'avez pas les permissions nécessaires pour accéder à cette page.</p>
      <button class="btn btn-primary" (click)="goToLogin()">Retour à la connexion</button>
    </div>
  `,
  styles: [
    `
      .unauthorized-container {
        text-align: center;
        padding: 50px;
      }
      h2 {
        color: #d33;
      }
      .btn-primary {
        margin-top: 20px;
        padding: 10px 20px;
      }
    `,
  ],
})
export class UnauthorizedComponent {
  constructor(private router: Router) {}

  goToLogin() {
    this.router.navigate(['/login']);
  }
}