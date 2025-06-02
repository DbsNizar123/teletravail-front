import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TeletravailRequestService } from '../services/teletravail-request.service';
import { GlobalSettingService } from '../services/global-setting.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-update-request',
  templateUrl: './update-request.component.html',
  styleUrls: ['./update-request.component.css']
})
export class UpdateRequestComponent implements OnInit {
  request: any = {
    date: '',
    reason: ''
  };
  errorMessage: string | null = null;
  availabilityStatus: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private teletravailRequestService: TeletravailRequestService,
    private globalSettingService: GlobalSettingService
  ) {}

  ngOnInit(): void {
    this.loadRequest();
  }

  loadRequest() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.teletravailRequestService.getRequestById(id).subscribe({
        next: (response) => {
          this.request = response.request;
          this.checkAvailability();
        },
        error: (error) => {
          Swal.fire({
            icon: 'error',
            title: 'Erreur...',
            text: 'Échec du chargement de la demande.',
          });
          this.router.navigate(['../voirdemande']);
        }
      });
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Erreur...',
        text: 'ID de la demande manquant.',
      });
      this.router.navigate(['../voirdemande']);
    }
  }

  checkAvailability() {
    if (!this.request.date) return;

    this.globalSettingService.checkAvailability(this.request.date).subscribe({
      next: (response) => {
        this.availabilityStatus = response.status;
      },
      error: (error) => {
        console.error('Error checking availability:', error);
        this.availabilityStatus = null;
      }
    });
  }

  onSubmit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      Swal.fire('Erreur', 'ID de la demande manquant.', 'error');
      return;
    }

    if (!this.request.date || !this.request.reason) {
      Swal.fire('Erreur', 'Veuillez remplir tous les champs', 'error');
      return;
    }

    this.globalSettingService.checkAvailability(this.request.date).subscribe({
      next: (response) => {
        if (response.status === 'blocked') {
          Swal.fire('Indisponible', 'Le télétravail est bloqué pour cette date', 'error');
          return;
        }

        if (response.status === 'limited' && response.remaining_slots <= 0) {
          Swal.fire('Limite atteinte', 'Le quota de télétravail est atteint pour cette date', 'warning');
          return;
        }
        
        this.teletravailRequestService.updateRequest(id, this.request).subscribe({
          next: (response) => {
            Swal.fire('Succès', 'Demande mise à jour avec succès', 'success');
            this.router.navigate(['../voirdemande']);
          },
          error: (error) => {
            this.errorMessage = 'Erreur lors de la mise à jour de la demande.';
            console.error(error);
          }
        });
      },
      error: (error) => {
        Swal.fire('Erreur', 'Impossible de vérifier la disponibilité', 'error');
      }
    });
  }
}