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
}