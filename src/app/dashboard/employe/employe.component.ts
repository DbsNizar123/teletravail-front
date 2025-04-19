import { Component, OnInit, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { AuthService } from '../../auth.service';
import { NotificationService } from '../../services/notification.service';

interface User {
  name: string;
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
  selector: 'app-employe',
  templateUrl: './employe.component.html',
  styleUrls: ['./employe.component.css']
})
export class EmployeComponent implements OnInit {
  user: User | null = null;
  notifications: Notification[] = [];
  unreadNotificationCount: number = 0;
  showNotifications: boolean = false;
  showSettingsMenu: boolean = false;
  isSidebarCollapsed: boolean = false;
  openMenus: { [key: string]: boolean } = {
    demandes: false
  };

  constructor(
    private authService: AuthService,
    private notificationService: NotificationService,
    private router: Router
  ) {}

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
      }
    });
  }

  loadNotifications(): void {
    this.notificationService.getNotifications().subscribe({
      next: (response: any) => {
        this.notifications = response.data;
        this.updateUnreadCount();
      },
      error: (error) => {
        console.error('Error fetching notifications:', error);
        Swal.fire({
          icon: 'error',
          title: 'Erreur',
          text: 'Impossible de charger les notifications.'
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
      }
    });
  }

  markAllNotificationsAsRead(): void {
    this.notificationService.markAllAsRead().subscribe({
      next: () => {
        this.notifications.forEach(n => n.is_read = true);
        this.updateUnreadCount();
      },
      error: (error) => {
        console.error('Error marking all notifications as read:', error);
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