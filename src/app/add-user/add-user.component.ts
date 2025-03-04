import { Component } from '@angular/core';
import { AuthService } from '../auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html'
})
export class AddUserComponent {
  userData = { name: '', email: '', password: '', role: '' };
  successMessage: string = '';
  errorMessage: string = '';

  constructor(private authService: AuthService) {}

  addUser() {
    this.authService.addUser(this.userData).subscribe(
      (response) => {
        // Afficher une alerte de succès avec SweetAlert2
        Swal.fire({
          title: 'Success!',
          text: 'User added successfully!',
          icon: 'success',
          confirmButtonText: 'OK'
        });

        // Réinitialiser le formulaire
        this.userData = { name: '', email: '', password: '', role: '' };
      },
      (error) => {
        // Afficher une alerte d'erreur avec SweetAlert2
        Swal.fire({
          title: 'Error!',
          text: 'Failed to add user. Please try again.',
          icon: 'error',
          confirmButtonText: 'OK'
        });
      }
    ); // Fermer la méthode subscribe
  } // Fermer la méthode addUser
}