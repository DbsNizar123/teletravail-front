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

  constructor(private teletravailRequestService: TeletravailRequestService) {}

  ngOnInit(): void {
    this.loadRequests();
  }

  loadRequests() {
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

  onStatusChange(request: any, event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    const newStatus = selectElement.value;
    
    // Animation
    selectElement.classList.add('status-change');
    setTimeout(() => {
      selectElement.classList.remove('status-change');
    }, 300);

    // Mise à jour du statut
    if (newStatus === 'accept' || newStatus === 'reject') {
      request.status = newStatus === 'accept' ? 'approved' : 'rejected';
      
      // Ici vous pourriez appeler un service pour sauvegarder le changement
      // this.teletravailRequestService.updateRequestStatus(request.id, request.status).subscribe(...);
    }
  }
}