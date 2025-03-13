import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { AuthService } from '../../auth.service';

@Component({
  selector: 'app-manager',
  templateUrl: './manager.component.html',
  styleUrls: ['./manager.component.css']
})
export class ManagerComponent implements OnInit {

  user: any;
  notifications: any[] = [];
  showNotifications: boolean = false;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.loadProfile();
    this.loadNotifications();
  }

  loadProfile() {
    this.authService.getProfile().subscribe(
      response => {
        this.user = response;
      },
      error => {
        console.error('Error fetching profile:', error);
      }
    );
  }

  loadNotifications() {
    // Simuler des notifications
  
  }

  toggleNotifications() {
    this.showNotifications = !this.showNotifications;
  }

  confirmLogout() {
    Swal.fire({
      title: 'Are you sure?',
      text: 'Do you really want to logout?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, logout!',
      cancelButtonText: 'No, cancel!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.logout();
      }
    });
  }

  logout() {
    this.authService.logout().subscribe(
      response => {
        Swal.fire('Logged out!', 'You have been logged out.', 'success');
        localStorage.removeItem('token'); // Clear the token
        this.router.navigate(['/login']); // Redirect to login page
      },
      error => {
        console.error('Logout failed:', error);
      }
    );
  }
}