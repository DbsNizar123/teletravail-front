// src/app/modifier-user/modifier-user.component.ts

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../auth.service';
AuthService

@Component({
  selector: 'app-modifier-user',
  templateUrl: './modifier-user.component.html',
  styleUrls: ['./modifier-user.component.css']
})
export class ModifierUserComponent implements OnInit {
  user: any = {};

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    const userId = this.route.snapshot.paramMap.get('id'); // Récupère l'ID de l'utilisateur
    if (userId) {
      this.authService.getUserById(+userId).subscribe(
        data => this.user = data,
        error => console.error('Erreur lors de la récupération de l\'utilisateur', error)
      );
    }
  }

  onSubmit(): void {
    this.authService.updateUser(this.user.id, this.user).subscribe(
      () => {
        alert('Utilisateur modifié avec succès');
        this.router.navigate(['/user-list']);
      },
      error => console.error('Erreur lors de la modification de l\'utilisateur', error)
    );
  }
}