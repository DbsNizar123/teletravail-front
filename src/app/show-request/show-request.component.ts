import { Component, OnInit } from '@angular/core';
import { TeletravailRequestService } from '../services/teletravail-request.service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

@Component({
  selector: 'app-show-request',
  templateUrl: './show-request.component.html',
  styleUrls: ['./show-request.component.css']
})
export class ShowRequestComponent implements OnInit {
  requests: any[] = [];

  constructor(private teletravailRequestService: TeletravailRequestService,  private router: Router) {}

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
  editRequest(requestId: string) {
    this.router.navigate([`/employee/modifierdemande/${requestId}`]);
  }
}