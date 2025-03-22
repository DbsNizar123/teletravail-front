import { Component, OnInit } from '@angular/core';
import { TeletravailRequestService } from '../services/teletravail-request.service';
import { AuthService } from '../auth.service'; // Import AuthService
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

@Component({
  selector: 'app-show-request',
  templateUrl: './show-request.component.html',
  styleUrls: ['./show-request.component.css']
})
export class ShowRequestComponent implements OnInit {
  requests: any[] = [];
  currentPage: number = 1;
  totalPages: number = 0;
  limit: number = 10; // Number of requests per page

  constructor(
    private teletravailRequestService: TeletravailRequestService,
    private authService: AuthService, // Inject AuthService
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadRequests();
  }

  loadRequests() {
    this.teletravailRequestService.getRequests(this.currentPage, this.limit).subscribe({
      next: (response) => {
        this.requests = response.requests.data; // Adjust based on your API response
        this.totalPages = response.requests.last_page; // Adjust based on your API response
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
    this.authService.getUserRoles().subscribe({
      next: (roles) => {
        if (roles.includes('manager')) {
          this.router.navigate([`manager/modifierdemande/${requestId}`]);
        } else if (roles.includes('employee')) {
          this.router.navigate([`employee/modifierdemande/${requestId}`]);
        } else {
          Swal.fire('Accès refusé', 'Vous n\'avez pas l\'autorisation de modifier cette demande.', 'error');
        }
      },
      error: () => {
        Swal.fire('Erreur', 'Erreur lors de la récupération des rôles.', 'error');
      }
    });
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.loadRequests();
    }
  }

  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.loadRequests();
    }
  }
}