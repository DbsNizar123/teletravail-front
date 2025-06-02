import { Component } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'] 
})
export class LoginComponent {
  credentials = { email: '', password: '' };
  token: string | null = null;

  constructor(private authService: AuthService, private router: Router) {}
  onForgotPassword() {
    this.router.navigate(['/forgot-password']);
  }
  togglePasswordVisibility(input: HTMLInputElement) {
    const icon = input.nextElementSibling as HTMLElement;
    if (input.type === 'password') {
      input.type = 'text';
      icon.classList.remove('fa-eye');
      icon.classList.add('fa-eye-slash', 'active');
    } else {
      input.type = 'password';
      icon.classList.remove('fa-eye-slash', 'active');
      icon.classList.add('fa-eye');
    }
  }
  login() {
    if (!this.credentials.email || !this.credentials.password) {
      Swal.fire({
        title: 'Erreur!',
        text: 'Veuillez remplir tous les champs.',
        icon: 'error',
        confirmButtonText: 'OK'
      });
      return;
    }

    this.authService.login(this.credentials).subscribe(
      (response) => {
        localStorage.setItem('token', response.token);
        this.authService.getUserRoles().subscribe(
          (roles) => {
            if (roles.includes('admin')) {
              this.router.navigate(['/admin/global-settings']);
            } else if (roles.includes('manager')) {
              this.router.navigate(['/manager/calendar']); 
            } else if (roles.includes('employee')) { 
              this.router.navigate(['/employee/calendar']); 
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
