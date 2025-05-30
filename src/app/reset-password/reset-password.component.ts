import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';
import Swal from 'sweetalert2'; // Importation de SweetAlert2

// Interface pour la réponse de l'API
interface ResetPasswordResponse {
  message: string;
}

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {
  resetPasswordForm: FormGroup;
  token: string = '';

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    // Initialisation du formulaire avec validation
    this.resetPasswordForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      password_confirmation: ['', Validators.required]
    }, { validator: this.checkPasswords });
  }

  ngOnInit(): void {
    // Récupération du token depuis l'URL
    this.token = this.route.snapshot.paramMap.get('token') || '';
  }

  // Validation personnalisée pour vérifier que les mots de passe correspondent
  checkPasswords(group: FormGroup) {
    const password = group.get('password')?.value;
    const passwordConfirmation = group.get('password_confirmation')?.value;
    return password === passwordConfirmation ? null : { notSame: true };
  }

  onSubmit(): void {
    if (this.resetPasswordForm.valid) {
      const formData = {
        token: this.token,
        ...this.resetPasswordForm.value
      };

      // Appel du service pour réinitialiser le mot de passe
      this.authService.resetPassword(formData).subscribe(
        (response: ResetPasswordResponse) => {
          // Affichage d'une alerte de succès avec SweetAlert2
          Swal.fire({
            title: 'Succès!',
            text: "Votre mot de passe a été réinitialisé",
            icon: 'success',
            confirmButtonText: 'OK'
          }).then(() => {
            this.router.navigate(['/login']); 
          });
        },
        (error: any) => {
          Swal.fire({
            title: 'Erreur ',
            text: 'Une erreur est produite lors de la réinitialisation du mot de passe. Veuillez réessayer.',
            icon: 'error',
            confirmButtonText: 'OK'
          });
        }
      );
    } else {
      Swal.fire({
        title: 'Formulaire invalide',
        text: 'Veuillez remplir le formulaire correctement.',
        icon: 'warning',
        confirmButtonText: 'OK'
      });
    }
  }
}
