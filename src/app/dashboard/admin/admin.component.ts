import { Component } from '@angular/core';
import { AuthService } from '../../auth.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent {

  constructor(private authService: AuthService, private router: Router) {}
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
        localStorage.removeItem('token'); // Remove token from local storage
        Swal.fire('Logged out!', 'You have been logged out.', 'success');
        this.router.navigate(['/login']); // Redirect to login page
      },
      error => {
        console.error('Logout failed:', error);
      }
    );
  }
  
}