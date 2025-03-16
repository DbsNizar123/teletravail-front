import { Component } from '@angular/core';
import { TeletravailRequestService } from '../services/teletravail-request.service';
import Swal from 'sweetalert2'; // Import SweetAlert2

@Component({
  selector: 'app-submit-teletravail-request',
  templateUrl: './submit-teletravail-request.component.html',
})
export class SubmitTeletravailRequestComponent {
  requestData = {
    date: '',
    reason: '',
  };

  constructor(private teletravailRequestService: TeletravailRequestService) {}

  onSubmit() {
    this.teletravailRequestService.submitRequest(this.requestData).subscribe({
      next: (response) => {
        Swal.fire({
          icon: 'success',
          title: 'Succès!',
          text: 'Demande soumise avec succès !',
        });
        console.log(response);
      },
      error: (error) => {
        Swal.fire({
          icon: 'error',
          title: 'Erreur...',
          text: 'Erreur lors de la soumission de la demande.',
        });
        console.error(error);
      },
    });
  }
}