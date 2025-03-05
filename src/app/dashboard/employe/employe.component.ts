import { Component } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { AuthService } from '../../auth.service';

@Component({
  selector: 'app-employe',
  templateUrl: './employe.component.html',
  styleUrl: './employe.component.css'
})
export class EmployeComponent {
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
