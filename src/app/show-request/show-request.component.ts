import { Component, OnInit } from '@angular/core';
import { TeletravailRequestService } from '../services/teletravail-request.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-show-request',
  templateUrl: './show-request.component.html',
})
export class ShowRequestComponent implements OnInit {
  requests: any[] = [];

  constructor(private teletravailRequestService: TeletravailRequestService) {}

  ngOnInit(): void {
    this.loadRequests();
  }

  loadRequests() {
    this.teletravailRequestService.getRequests().subscribe({
      next: (response) => {
        this.requests = response.requests; // Assurez-vous que la réponse a cette structure
      },
      error: (error) => {
        Swal.fire({
          icon: 'error',
          title: 'Erreur...',
          text: 'Erreur lors du chargement des demandes.',
        });
        console.error(error);
      },
    });
  }
}