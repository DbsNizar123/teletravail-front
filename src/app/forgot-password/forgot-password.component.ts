import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import Swal from 'sweetalert2'; // Importation de SweetAlert2

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent {
  email: string = '';

  constructor(private http: HttpClient, private router: Router) {}

  onSubmit() {
    this.http.post('http://localhost:8000/api/forgot-password', { email: this.email })
      .subscribe(
        (response: any) => {
          Swal.fire({
            title: 'Succès!',
            text: "Nous vous avons envoyé par e-mail votre lien de réinitialisation de mot de passe.",
            icon: 'success',
            confirmButtonText: 'OK'
          }).then(() => {
            this.router.navigate(['/login']);
          });
        },
        (error) => {
          Swal.fire({
            title: 'Erreur',
            text: 'Une erreur est produite. Veuillez réessayer.',
            icon: 'error',
            confirmButtonText: 'OK'
          });
        }
      );
  }
}
