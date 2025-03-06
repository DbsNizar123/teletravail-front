// src/app/components/login/login.component.ts

import { Component } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router'; // Import Router pour la navigation
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'] 
})
export class LoginComponent {
  credentials = { email: '', password: '' }; // Initialisation des champs email et password
  token: string | null = null; // Initialisation du token

  constructor(private authService: AuthService, private router: Router) {}
  onForgotPassword() {
    // Rediriger vers la page de réinitialisation de mot de passe
    this.router.navigate(['/forgot-password']);
  }
  login() {
    // Vérifier que les champs email et password ne sont pas vides
    if (!this.credentials.email || !this.credentials.password) {
      Swal.fire({
        title: 'Erreur!',
        text: 'Veuillez remplir tous les champs.',
        icon: 'error',
        confirmButtonText: 'OK'
      });
      return; // Arrêter l'exécution de la fonction
    }

    // Appeler le service d'authentification
    this.authService.login(this.credentials).subscribe(
      (response) => {
        // Stocker le token dans le localStorage
        localStorage.setItem('token', response.token);

        // Récupérer les rôles de l'utilisateur pour la redirection
        this.authService.getUserRoles().subscribe(
          (roles) => {
            if (roles.includes('admin')) {
              this.router.navigate(['/admin']); 
            } else if (roles.includes('manager')) {
              this.router.navigate(['/manager']); 
            } else if (roles.includes('employee')) { 
              this.router.navigate(['/employee']); 
            } else {
              Swal.fire({
                title: 'Erreur!',
                text: 'Aucun rôle correspondant trouvé.',
                icon: 'error',
                confirmButtonText: 'OK'
              });
            }
          },
          (error) => {
            Swal.fire({
              title: 'Erreur!',
              text: 'Erreur lors de la récupération des rôles.',
              icon: 'error',
              confirmButtonText: 'OK'
            });
          }
        );
      },
      (error) => {
        Swal.fire({
          title: 'Erreur!',
          text: 'Identifiants incorrects.',
          icon: 'error',
          confirmButtonText: 'OK'
        });
      }
    );
  }
}
