import { Component, OnInit, HostListener } from '@angular/core';
import { AuthService } from '../../auth.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

interface User {
  name: string;
  // Add other user properties as needed
}

interface Notification {
  id: number;
  message: string;
  date?: Date;
}

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {
  user: User | null = null;
  notifications: Notification[] = [];
  showNotifications: boolean = false;
  showSettingsMenu: boolean = false;
  isSidebarCollapsed: boolean = false;
  openMenus: { [key: string]: boolean } = {
    settings: false
  };

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.loadProfile();
    this.loadNotifications();
    this.checkScreenSize();
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: Event) {
    this.checkScreenSize();
  }

  checkScreenSize() {
    if (window.innerWidth < 768) {
      this.isSidebarCollapsed = true;
    }
  }

  toggleSidebar(): void {
    this.isSidebarCollapsed = !this.isSidebarCollapsed;
  }

  loadProfile(): void {
    this.authService.getProfile().subscribe({
      next: (response: User) => {
        this.user = response;
      },
      error: (error) => {
        console.error('Error fetching profile:', error);
        Swal.fire('Error', 'Failed to load profile', 'error');
      }
    });
  }

  loadNotifications(): void {
    // Implement your notification loading logic here
    // Example:
    // this.authService.getNotifications().subscribe({
    //   next: (notifications) => this.notifications = notifications,
    //   error: (error) => console.error('Error loading notifications:', error)
    // });
  }

  toggleMenu(menuKey: string): void {
    this.openMenus[menuKey] = !this.openMenus[menuKey];
  }

  isMenuOpen(menuKey: string): boolean {
    return this.openMenus[menuKey];
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