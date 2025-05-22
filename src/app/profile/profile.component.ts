import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent implements OnInit {

  user: any = {};
  loading: boolean = false;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.loadProfile();
  }

  loadProfile() {
    this.loading = true;
    this.authService.getProfile().subscribe(
      response => {
        this.user = response;
        this.loading = false;
      },
      error => {
        console.error('Error fetching profile:', error);
        this.loading = false;
      }
    );
  }

  updateProfile() {
    this.authService.updateProfile(this.user).subscribe(
      response => {
        Swal.fire('Success!', response.message, 'success');
      },
      error => {
        Swal.fire('Error!', 'Failed to update profile.', 'error');
        console.error('Error updating profile:', error);
      }
    );
  }

}
