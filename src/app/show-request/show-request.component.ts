import { Component, OnInit } from '@angular/core';
import { TeletravailRequestService } from '../services/teletravail-request.service';
import { AuthService } from '../auth.service';
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
  limit: number = 10;
  loading: boolean = true;

  constructor(
    private teletravailRequestService: TeletravailRequestService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadRequests();
  }

  loadRequests() {
    this.loading = true;
    const loadingTimeout = setTimeout(() => {
        this.loading = false;
    }, 2500);

    this.teletravailRequestService.getRequests(this.currentPage, this.limit).subscribe({
        next: (response) => {
            this.requests = response.requests.data;
            this.totalPages = response.requests.last_page;
            if (this.loading === false) {
                clearTimeout(loadingTimeout);
            } else {
                this.loading = false;
                clearTimeout(loadingTimeout);
            }
        },
    });
}
  translateStatus(status: string): string {
    const statusMap: { [key: string]: string } = {
      'pending': 'En attente',
      'approved': 'Approuvé',
      'rejected': 'Rejeté'
    };
    return statusMap[status] || status;
  }


  editRequest(requestId: string, currentStatus: string) {
    if (currentStatus !== 'pending') {
        Swal.fire('Action impossible', 'Seules les demandes en attente peuvent être modifiées.', 'error');
        return;
    }

    this.loading = true;
    this.authService.getUserRoles().subscribe({
        next: (roles) => {
            this.loading = false;
            if (roles.includes('manager')) {
                this.router.navigate([`manager/modifierdemande/${requestId}`]);
            } else if (roles.includes('employee')) {
                this.router.navigate([`employee/modifierdemande/${requestId}`]);
            } else {
                Swal.fire('Accès refusé', 'Vous n\'avez pas l\'autorisation de modifier cette demande.', 'error');
            }
        },
        error: () => {
            this.loading = false;
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