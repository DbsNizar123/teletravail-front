import { Component, OnInit } from '@angular/core';
import { TeletravailRequestService } from '../services/teletravail-request.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-submit-teletravail-request',
  templateUrl: './submit-teletravail-request.component.html',
  styleUrls: ['./submit-teletravail-request.component.css']
})
export class SubmitTeletravailRequestComponent {
  // Données du formulaire simplifiées (sans department_id)
  requestData = {
    date: '',
    reason: ''
  };

  constructor(
    private teletravailRequestService: TeletravailRequestService
  ) {}

  // Soumettre la demande de télétravail
  onSubmit() {
    if (!this.requestData.date || !this.requestData.reason) {
      Swal.fire({
        icon: 'error',
        title: 'Erreur',
        text: 'Veuillez remplir tous les champs obligatoires'
      });
      return;
    }

    this.teletravailRequestService.submitRequest(this.requestData).subscribe({
      next: (response) => {
        Swal.fire({
          icon: 'success',
          title: 'Succès!',
          text: 'Demande soumise avec succès !',
        });
        this.resetForm();
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

  // Réinitialiser le formulaire
  resetForm(): void {
    this.requestData = {
      date: '',
      reason: ''
    };
  }
}