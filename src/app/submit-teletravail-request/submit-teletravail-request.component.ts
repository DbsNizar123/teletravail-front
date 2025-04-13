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
  availabilityDetails: any = null; 
  constructor(
    private teletravailRequestService: TeletravailRequestService,
    private globalSettingService: GlobalSettingService
  ) {}

checkAvailability() {
  if (!this.requestData.date) return;

  this.globalSettingService.checkAvailability(this.requestData.date).subscribe({
    next: (response) => {
      this.availabilityStatus = response.status;
      this.availabilityDetails = response; 
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

  this.globalSettingService.checkAvailability(this.requestData.date).subscribe({
    next: (response) => {
      if (response.status === 'blocked') {
        Swal.fire({
          title: 'Indisponible',
          html: `Le télétravail est bloqué pour cette date.<br>${response.message}`,
          icon: 'error'
        });
        return;
      }

      this.teletravailRequestService.submitRequest(this.requestData).subscribe({
        next: (submitResponse) => {
          Swal.fire({
            title: 'Succès',
            html: `Demande soumise avec succès!<br>
                  Statut: <strong>En attente d'approbation</strong><br>
                  Places restantes: ${response.remaining_slots}/${response.absolute_limit}`,
            icon: 'success'
          });
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
