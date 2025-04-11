import { Component } from '@angular/core';
import { TeletravailRequestService } from '../services/teletravail-request.service';
import { GlobalSettingService } from '../services/global-setting.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-submit-teletravail-request',
  templateUrl: './submit-teletravail-request.component.html',
  styleUrls: ['./submit-teletravail-request.component.css']
})
export class SubmitTeletravailRequestComponent {
  requestData = {
    date: '',
    reason: ''
  };
  availabilityStatus: string | null = null;

  constructor(
    private teletravailRequestService: TeletravailRequestService,
    private globalSettingService: GlobalSettingService
  ) {}

  checkAvailability() {
    if (!this.requestData.date) return;

    this.globalSettingService.checkAvailability(this.requestData.date).subscribe({
      next: (response) => {
        this.availabilityStatus = response.status;
      },
      error: (error) => {
        console.error('Error checking availability:', error);
      }
    });
  }

  onSubmit() {
    if (!this.requestData.date || !this.requestData.reason) {
      Swal.fire('Erreur', 'Veuillez remplir tous les champs', 'error');
      return;
    }

    // Vérifier la disponibilité avant soumission
    this.globalSettingService.checkAvailability(this.requestData.date).subscribe({
      next: (response) => {
        if (response.status === 'blocked') {
          Swal.fire('Indisponible', 'Le télétravail est bloqué pour cette date', 'error');
          return;
        }

        if (response.status === 'limited' && response.remaining_slots <= 0) {
          Swal.fire('Limite atteinte', 'Le quota de télétravail est atteint pour cette date', 'warning');
          return;
        }

        // Si disponible, soumettre la demande
        this.teletravailRequestService.submitRequest(this.requestData).subscribe({
          next: (response) => {
            Swal.fire('Succès', 'Demande soumise avec succès', 'success');
            this.resetForm();
          },
          error: (error) => {
            Swal.fire('Erreur', 'Échec de la soumission', 'error');
          }
        });
      },
      error: (error) => {
        Swal.fire('Erreur', 'Impossible de vérifier la disponibilité', 'error');
      }
    });
  }

  resetForm(): void {
    this.requestData = { date: '', reason: '' };
    this.availabilityStatus = null;
  }
} 
