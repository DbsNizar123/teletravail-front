import { Component, OnInit } from '@angular/core';
import { TeletravailRequestService } from '../services/teletravail-request.service';
import Swal from 'sweetalert2';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-show-requests',
  templateUrl: './show-requests.component.html',
  styleUrls: ['./show-requests.component.css']
})
export class ShowRequestsComponent implements OnInit {
  requests: any[] = [];
  loading = false;
  isAdmin: boolean = false;
  isManager: boolean = false;
  currentUserId: number | null = null;

  constructor(
    private teletravailRequestService: TeletravailRequestService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.getCurrentUserId();
    this.checkUserRole();
    this.loadRequests();
  }

  checkUserRole(): void {
    this.authService.getUserRoles().subscribe(
      (roles: string[]) => {
        this.isAdmin = roles.includes('admin');
        this.isManager = roles.includes('manager');
      },
      error => {
        console.error('Error getting user roles:', error);
        Swal.fire({
          icon: 'error',
          title: 'Erreur',
          text: 'Impossible de récupérer les rôles utilisateur.'
        });
      }
    );
  }

  getCurrentUserId(): void {
    this.authService.getProfile().subscribe(
      (profile: any) => {
        this.currentUserId = profile.id;
      },
      error => {
        console.error('Error getting user profile:', error);
        Swal.fire({
          icon: 'error',
          title: 'Erreur',
          text: 'Impossible de récupérer le profil utilisateur.'
        });
      }
    );
  }

  loadRequests(): void {
    this.loading = true;
    this.teletravailRequestService.getAllRequestss().subscribe(
      (response: any) => {
        this.requests = response.data;
        this.loading = false;
      },
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

      Swal.fire({
        title: 'Confirmer la modification',
        text: `Voulez-vous vraiment ${updatedStatus === 'approved' ? 'approuver' : 'rejeter'} cette demande ?`,
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Oui',
        cancelButtonText: 'Non'
      }).then((result) => {
        if (result.isConfirmed) {
          selectElement.classList.add('status-change');
          
          this.teletravailRequestService.updateRequestStatus(request.id, updatedStatus).subscribe(
            (response) => {
              request.status = updatedStatus;
              this.requests = [...this.requests]; // Trigger change detection
              Swal.fire({
                icon: 'success',
                title: 'Succès',
                text: 'Statut mis à jour avec succès.'
              });
            },
            (error) => {
              console.error('Error updating request status:', error);
              selectElement.value = request.status; // Revert dropdown
              Swal.fire({
                icon: 'error',
                title: 'Erreur',
                text: error.message || 'Erreur lors de la mise à jour du statut. Veuillez réessayer.'
              });
            }
          );
        } else {
          selectElement.value = request.status; // Revert dropdown on cancel
        }
      });
    }
  }

  canModifyRequest(request: any): boolean {
    if (this.isAdmin) return true;
    if (!this.isManager) return false;

    const isEmployee = !request.user.roles || 
                      !request.user.roles.includes('manager') && 
                      !request.user.roles.includes('admin');
    
    return isEmployee && request.user.id !== this.currentUserId;
  }
}