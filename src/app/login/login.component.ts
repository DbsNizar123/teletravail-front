import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../auth.service'; // Import AuthService
import { Router } from '@angular/router'; // Import Router for navigation

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  errorMessage: string | null = null; // For displaying error messages

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  ngOnInit(): void {}

  onSubmit() {
    if (this.loginForm.valid) {
      this.authService.login(this.loginForm.value.email, this.loginForm.value.password).subscribe(
        response => {
          console.log('Login successful!', response);
          localStorage.setItem('token', response.token); // Store the token
          this.router.navigate(['/dashboard']); // Navigate to the dashboard or another route
        },
        error => {
          console.error('Login error', error);
          if (error.status === 401) {
            this.errorMessage = 'Invalid email or password'; // Display specific message for unauthorized
          } else {
            this.errorMessage = 'An unexpected error occurred'; // General error message
          }
        }
      );
    } else {
      console.log('Login form is invalid');
    }
  }
}