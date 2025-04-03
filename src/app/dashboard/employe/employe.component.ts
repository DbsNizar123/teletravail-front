import { Component, OnInit, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { AuthService } from '../../auth.service';

interface User {
  name: string;
}

interface Notification {
  id: number;
  message: string;
  date?: Date;
}

@Component({
  selector: 'app-employe',
  templateUrl: './employe.component.html',
  styleUrls: ['./employe.component.css']
})
export class EmployeComponent implements OnInit {
  user: User | null = null;
  notifications: Notification[] = [];
  showNotifications: boolean = false;
  showSettingsMenu: boolean = false;
  openMenus: { [key: string]: boolean } = {
    demandes: false
  };

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.loadProfile();
    this.loadNotifications();
  }

  loadProfile(): void {
    this.authService.getProfile().subscribe({
      next: (response: User) => {
        this.user = response;
      },
      error: (error) => {
        console.error('Error fetching profile:', error);
      }
    });
  }

  loadNotifications(): void {
    // Simuler des notifications ou implémenter la logique réelle
  }

  toggleNotifications(event: Event): void {
    event.stopPropagation();
    this.showNotifications = !this.showNotifications;
    if (this.showNotifications) {
      this.showSettingsMenu = false;
    }
  }

  toggleSettingsMenu(event: Event): void {
    event.stopPropagation();
    this.showSettingsMenu = !this.showSettingsMenu;
    if (this.showSettingsMenu) {
      this.showNotifications = false;
    }
  }

  toggleMenu(menuKey: string): void {
    this.openMenus[menuKey] = !this.openMenus[menuKey];
  }

  isMenuOpen(menuKey: string): boolean {
    return this.openMenus[menuKey];
  }

  confirmLogout(): void {
    Swal.fire({
      title: 'Êtes-vous sûr ?',
      text: 'Voulez-vous vraiment vous déconnecter ?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Oui, me déconnecter !',
      cancelButtonText: 'Non, annuler !'
    }).then((result) => {
      if (result.isConfirmed) {
        this.logout();
      }
    });
  }
  
  logout(): void {
    this.authService.logout().subscribe({
      next: () => {
        Swal.fire('Déconnexion réussie !', 'Vous avez été déconnecté.', 'success');
        localStorage.removeItem('token');
        this.router.navigate(['/login']);
      },
      error: (error) => {
        console.error('Échec de la déconnexion :', error);
      }
    });
  }

  @HostListener('document:click')
  onDocumentClick(): void {
    this.showNotifications = false;
    this.showSettingsMenu = false;
  }
}