import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-update-user',
  templateUrl: './update-user.component.html',
  styleUrls: ['./update-user.component.css']
})
export class UpdateUserComponent implements OnInit {
  userId!: number;
  user: any = {
    name: '',
    email: '',
    role: ''
  };
  roles: string[] = ['admin', 'manager', 'employee'];

  constructor(
    private authService: AuthService,
    private route: ActivatedRoute,
    public router: Router
  ) {}

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    this.userId = idParam ? +idParam : 0; // Convert to number
    this.loadUser();
  }

  loadUser() {
    if (this.userId) {
      this.authService.getUserById(this.userId).subscribe(
        (data) => {
          this.user = data;
        }
      );
    } else {
      Swal.fire('Error!', 'Invalid user ID.', 'error');
      this.router.navigate(['/admin/user-list']);
    }
  }

  updateUser() {
    this.authService.updateUser(this.userId, this.user).subscribe(
      (response) => {
        Swal.fire('Success!', 'User updated successfully.', 'success');
        this.router.navigate(['/admin/user-list']);
      },
      (error) => {
        console.error('Error updating user', error);
        Swal.fire('Error!', 'Failed to update user.', 'error');
      }
    );
  }
}