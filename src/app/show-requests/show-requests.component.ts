// show-requests.component.ts
import { Component, OnInit } from '@angular/core';
import { TeletravailRequestService } from '../services/teletravail-request.service';

@Component({
  selector: 'app-show-requests',
  templateUrl: './show-requests.component.html',
  styleUrls: ['./show-requests.component.css']
})
export class ShowRequestsComponent implements OnInit {
  requests: any[] = [];
  loading = false;
  isAdmin: boolean = false; // Ajouté pour gérer les permissions admin

  constructor(private teletravailRequestService: TeletravailRequestService) {}

  ngOnInit(): void {
    this.loadRequests();
    this.checkAdminRole(); // Vérifiez le rôle au chargement
  }

  checkAdminRole() {
    // À implémenter selon votre système d'authentification
    // Par exemple, vérifier si l'utilisateur a le rôle 'admin'
    this.isAdmin = true; // Pour les tests, à remplacer par une vraie vérification
  }

  loadRequests(): void {
    this.loading = true;
    this.teletravailRequestService.getAllRequestss().subscribe(
      (response: any) => {
        this.requests = response.data;
        this.loading = false;
      },
      error => {
        console.error('Error:', error);
        this.loading = false;
      }
    );
  }

  translateStatus(status: string): string {
    const statusMap: { [key: string]: string } = {
      'pending': 'En attente',
      'approved': 'Approuvé',
      'rejected': 'Rejeté'
    };
    return statusMap[status] || status;
  }

  onStatusChange(request: any, event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    const newStatus = selectElement.value;

    if (newStatus === 'accept' || newStatus === 'reject') {
      const updatedStatus = newStatus === 'accept' ? 'approved' : 'rejected';

      // Animation
      selectElement.classList.add('status-change');

      // Appel API pour mettre à jour le statut
      this.teletravailRequestService.updateRequestStatus(request.id, updatedStatus).subscribe(
        (response) => {
          request.status = updatedStatus; // Mise à jour du statut local
          this.requests = [...this.requests]; // Forcer le rafraîchissement de la liste
        },
        (error) => {
          console.error('Error updating status:', error);
          selectElement.value = request.status; // Revenir à l'état précédent en cas d'erreur
        }
      );
    }
  }
}