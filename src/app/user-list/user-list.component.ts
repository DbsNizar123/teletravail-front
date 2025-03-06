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

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit(): void {
    this.authService.getAllUsers().subscribe(
      (data: any) => {
        this.users = data;
      },
      (error) => {
        console.error('Erreur lors de la récupération des utilisateurs', error);
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
          (response) => {
            Swal.fire('Supprimé!', 'L\'utilisateur a été supprimé.', 'success');
            this.users = this.users.filter(u => u.id !== user.id); // Mettre à jour la liste
          },
          (error) => {
            console.error('Erreur lors de la suppression de l\'utilisateur', error);
            Swal.fire('Erreur!', 'Impossible de supprimer l\'utilisateur.', 'error');
          }
        );
      }
    });
  }
}