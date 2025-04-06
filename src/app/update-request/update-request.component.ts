import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TeletravailRequestService } from '../services/teletravail-request.service';
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

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private teletravailRequestService: TeletravailRequestService
  ) {}

  ngOnInit(): void {
    this.loadRequest();
  }

  loadRequest() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) { // Vérifiez si id n'est pas null
      this.teletravailRequestService.getRequestById(id).subscribe({
        next: (response) => {
          this.request = response.request; // Assurez-vous que la réponse a cette structure
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

  onSubmit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) { // Vérifiez si id n'est pas null
      this.teletravailRequestService.updateRequest(id, this.request).subscribe({
        next: (response) => {
          Swal.fire('Succès', 'Demande mise à jour avec succès', 'success');
          this.router.navigate(['../voirdemande']);
         
        },
        error: (error) => {
          this.errorMessage = 'Erreur lors de la mise à jour de la demande.';
          console.error(error);
        },
      });
    }
  }
}