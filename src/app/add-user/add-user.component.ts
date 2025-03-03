// src/app/components/add-user/add-user.component.ts

import { Component } from '@angular/core';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html'
})
export class AddUserComponent {
  userData = { name: '', email: '', password: '', role: '' };

  constructor(private authService: AuthService) {}

  addUser() {
    this.authService.addUser(this.userData).subscribe(
      (response) => {
        console.log('User registered successfully', response);
        // Optionally reset the form or navigate
      },
      (error) => {
        console.error('User registration failed', error);
      }
    );
  }
}