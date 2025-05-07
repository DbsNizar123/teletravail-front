import { Component, OnInit, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../auth.service';
import { NotificationService } from '../../services/notification.service';
import Swal from 'sweetalert2';

interface User {
  id: number;
  name: string;
  email: string;
  profile_photo_url?: string;
}

interface Notification {
  id: number;
  message: string;
  type: string;
  is_read: boolean;
  created_at: string;
  data?: any;
}

@Component({
  selector: 'app-manager',
  templateUrl: './manager.component.html',
  styleUrls: ['./manager.component.css']
})
export class ManagerComponent implements OnInit {
  user: User | null = null;
  notifications: Notification[] = [];
  unreadNotificationCount: number = 0;
  showNotifications: boolean = false;
  showSettingsMenu: boolean = false;
  isSidebarCollapsed: boolean = false;
  openMenus: { [key: string]: boolean } = {
    demandes: false
  };
  isManager: boolean = false;

  constructor(
    private authService: AuthService,
    private notificationService: NotificationService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Load profile, notifications, and check screen size if authorized
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
      next: (response: any) => {
        this.user = {
          id: response.id,
          name: response.name,
          email: response.email,
          profile_photo_url: response.profile_photo_url
        };
      },
      error: (error) => {
        console.error('Error fetching profile:', error);
        Swal.fire({
          icon: 'error',
          title: 'Erreur',
          text: 'Impossible de charger le profil.'
        });
      }
    });
  }

  loadNotifications(): void {
    this.notificationService.getNotifications().subscribe({
      next: (response: any) => {
        console.log('Notifications response:', response);
        if (response && Array.isArray(response.data)) {
          this.notifications = response.data;
          this.updateUnreadCount();
        } else {
          console.warn('Invalid notifications response structure:', response);
          this.notifications = [];
        }
      },
      error: (error) => {
        console.error('Error fetching notifications:', {
          status: error.status,
          message: error.message,
          response: error.error
        });
        Swal.fire({
          icon: 'error',
          title: 'Erreur',
          text: `Impossible de charger les notifications: ${error.message}`
        });
      }
    });
  }

  markNotificationAsRead(notificationId: number): void {
    this.notificationService.markAsRead([notificationId]).subscribe({
      next: () => {
        const notification = this.notifications.find(n => n.id === notificationId);
        if (notification) {
          notification.is_read = true;
          this.updateUnreadCount();
        }
      },
      error: (error) => {
        console.error('Error marking notification as read:', error);
        Swal.fire({
          icon: 'error',
          title: 'Erreur',
          text: 'Impossible de marquer la notification comme lue.'
        });
      }
    });
  }

  markAllNotificationsAsRead(): void {
    this.notificationService.markAllAsRead().subscribe({
      next: () => {
        this.notifications.forEach(n => (n.is_read = true));
        this.updateUnreadCount();
      },
      error: (error) => {
        console.error('Error marking all notifications as read:', error);
        Swal.fire({
          icon: 'error',
          title: 'Erreur',
          text: 'Impossible de marquer toutes les notifications comme lues.'
        });
      }
    });
  }

  deleteNotification(notificationId: number, event: Event): void {
    event.stopPropagation();
    Swal.fire({
      title: 'Supprimer la notification ?',
      text: 'Voulez-vous vraiment supprimer cette notification ?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Oui, supprimer !',
      cancelButtonText: 'Annuler'
    }).then((result) => {
      if (result.isConfirmed) {
        this.notificationService.deleteNotification(notificationId).subscribe({
          next: () => {
            this.notifications = this.notifications.filter(n => n.id !== notificationId);
            this.updateUnreadCount();
            Swal.fire('Supprimée !', 'La notification a été supprimée.', 'success');
          },
          error: (error) => {
            console.error('Error deleting notification:', error);
            Swal.fire({
              icon: 'error',
              title: 'Erreur',
              text: 'Impossible de supprimer la notification.'
            });
          }
        });
      }
    });
  }

  private updateUnreadCount(): void {
    this.unreadNotificationCount = this.notifications.filter(n => !n.is_read).length;
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

  getInitials(name: string | null | undefined): string {
    if (!name) return '?';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
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
        Swal.fire({
          icon: 'error',
          title: 'Erreur',
          text: 'Échec de la déconnexion.'
        });
      }
    });
  }
  @HostListener('document:click')
  onDocumentClick(): void {
    this.showNotifications = false;
    this.showSettingsMenu = false;
  }
}