// src/app/components/login/login.component.ts

import { Component } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router'; // Import Router for navigation

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html'
})
export class LoginComponent {
  credentials = { email: '', password: '' };
  token: string | null = null;

  constructor(private authService: AuthService, private router: Router) {}

  login() {
    this.authService.login(this.credentials).subscribe(
      (response) => {
        this.token = response.token; // Store the token in the component
        localStorage.setItem('token', response.token); // Store the token in local storage
        
        // Fetch user roles to determine redirection
        this.authService.getUserRoles().subscribe(
          (roles) => {
            if (roles.includes('admin')) {
              this.router.navigate(['/addUser']); // Redirect to addUser if admin
            } else {
              this.router.navigate(['/dashboard']); // Redirect to dashboard or another page
            }
          },
          (error) => {
            console.error('Error fetching user roles', error);
          }
        );
      },
      (error) => {
        console.error('Login failed', error);
      }
    );
  }
}