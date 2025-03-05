// src/app/supprimer-user/supprimer-user.component.ts

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-supprimer-user',
  templateUrl: './supprimer-user.component.html',
  styleUrls: ['./supprimer-user.component.css']
})
export class SupprimerUserComponent implements OnInit {

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    const userId = this.route.snapshot.paramMap.get('id'); // Récupère l'ID de l'utilisateur
    if (userId && confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) {
      this.authService.deleteUser(+userId).subscribe(
        () => {
          alert('Utilisateur supprimé avec succès');
          this.router.navigate(['/user-list']);
        },
        error => console.error('Erreur lors de la suppression de l\'utilisateur', error)
      );
    } else {
      this.router.navigate(['/user-list']);
    }
  }
}