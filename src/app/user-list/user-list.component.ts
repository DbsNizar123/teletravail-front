import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit {
  users: any[] = [];
  currentPage: number = 1;
  totalPages: number = 0;
  limit: number = 6; // Number of users per page

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit(): void {
    this.loadUsers(this.currentPage, this.limit);
  }

  loadUsers(page: number, limit: number): void {
    this.authService.getAllUsers(page, limit).subscribe(
      (data: any) => {
        this.users = data.data; // Adjust based on your API response
        this.totalPages = data.last_page; // Adjust based on your API response
      },
      (error) => {
        console.error('Error fetching users', error);
      }
    );
  }

  updateUser(user: any): void {
    this.router.navigate(['/admin/update-user', user.id]);
  }

  deleteUser(user: any): void {
    Swal.fire({
      title: 'Êtes-vous sûr?',
      text: "Vous ne pourrez pas revenir en arrière!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Oui, supprimer!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.authService.deleteUser(user.id).subscribe(
          () => {
            Swal.fire('Supprimé!', 'L\'utilisateur a été supprimé.', 'success');
            this.users = this.users.filter(u => u.id !== user.id);
          },
          (error) => {
            console.error('Erreur lors de la suppression de l\'utilisateur', error);
            Swal.fire('Erreur!', 'Impossible de supprimer l\'utilisateur.', 'error');
          }
        );
      }
    });
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.loadUsers(this.currentPage, this.limit);
    }
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.loadUsers(this.currentPage, this.limit);
    }
  }
}