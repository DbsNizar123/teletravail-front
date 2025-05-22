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
  loading: boolean = true; // Ajout de la propriété loading

  constructor(
    private teletravailRequestService: TeletravailRequestService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadRequests();
  }

  loadRequests() {
    this.loading = true; // Activer l'indicateur de chargement

    // Définir un délai minimum de 3 secondes pour le chargement
    const loadingTimeout = setTimeout(() => {
        this.loading = false; // Désactiver l'indicateur de chargement après 3 secondes
    }, 2500);

    this.teletravailRequestService.getRequests(this.currentPage, this.limit).subscribe({
        next: (response) => {
            this.requests = response.requests.data;
            this.totalPages = response.requests.last_page;
            // Si la requête est terminée avant 3 secondes, le timeout gère this.loading = false
            // Si la requête prend plus de 3 secondes, désactiver immédiatement après la réponse
            if (this.loading === false) {
                // Timeout déjà exécuté, désactiver immédiatement
                clearTimeout(loadingTimeout);
            } else {
                // Timeout pas encore exécuté, le laisser gérer this.loading = false
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