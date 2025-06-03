import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import Swal from 'sweetalert2';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit {
  users: any[] = []; 
  filteredUsers: any[] = []; 
  cachedUsers: any[] = []; 
  currentPage: number = 1;
  totalPages: number = 0;
  limit: number = 6;
  searchTerm: string = '';
  visitedPages: Set<number> = new Set();

  constructor(
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    if (this.visitedPages.has(this.currentPage)) {
      this.users = this.cachedUsers.filter(u => 
        Math.floor((this.cachedUsers.indexOf(u) / this.limit) + 1) === this.currentPage
      );
      this.filterUsers();
      return;
    }

    this.authService.getAllUsers(this.currentPage, this.limit).subscribe(
      (data: any) => {
        this.users = data.data;
        this.totalPages = data.last_page;
        this.visitedPages.add(this.currentPage);

        data.data.forEach((newUser: any) => {
          if (!this.cachedUsers.some(u => u.id === newUser.id)) {
            this.cachedUsers.push(newUser);
          }
        });

        this.filterUsers();
      },
      (error) => {
        console.error('Erreur lors de la récupération des utilisateurs', error);
      }
    );
  }

  filterUsers(): void {
  const allowedRoles = ['manager', 'employee']; 

  if (!this.searchTerm) {
    this.filteredUsers = this.users.filter(user =>
      user.roles && user.roles.some((role: any) => allowedRoles.includes(role.name))
    );
  } else {
    this.filteredUsers = this.cachedUsers.filter(user =>
      user.name.toLowerCase().includes(this.searchTerm.toLowerCase()) &&
      user.roles && user.roles.some((role: any) => allowedRoles.includes(role.name))
    );
  }
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
            this.cachedUsers = this.cachedUsers.filter(u => u.id !== user.id);
            this.filterUsers();
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
      this.loadUsers();
    }
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.loadUsers();
    }
  }
}