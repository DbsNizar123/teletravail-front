import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';
import Swal from 'sweetalert2';

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
    this.resetPasswordForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      password_confirmation: ['', Validators.required]
    }, { validator: this.checkPasswords });
  }

  ngOnInit(): void {
    this.token = this.route.snapshot.paramMap.get('token') || '';
  }

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
      this.authService.resetPassword(formData).subscribe(
        (response: ResetPasswordResponse) => {
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
