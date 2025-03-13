import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../auth.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {

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
        console.log('Logout successful:', response);
        localStorage.removeItem('token');
        Swal.fire('Logged out!', 'You have been logged out.', 'success');
        this.router.navigate(['/login']);
      },
      error => {
        console.error('Logout failed:', error);
      }
    );
  }
}