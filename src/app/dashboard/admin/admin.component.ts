import { Component, OnInit, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { AuthService } from '../../auth.service';
import { NotificationService } from '../../services/notification.service';

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
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {
  user: User | null = null;
  notifications: Notification[] = [];
  unreadNotificationCount: number = 0;
  showNotifications: boolean = false;
  showSettingsMenu: boolean = false;
  isSidebarCollapsed: boolean = false;
  isDarkMode: boolean = false;
  isAdmin: boolean = false;

  constructor(
    private authService: AuthService,
    private notificationService: NotificationService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadProfile();
    this.loadNotifications();
    this.checkScreenSize();
    this.loadTheme();
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

  loadTheme(): void {
    const savedTheme = localStorage.getItem('theme');
    this.isDarkMode = savedTheme === 'dark' || 
                     (savedTheme === null && window.matchMedia('(prefers-color-scheme: dark)').matches);
    this.applyTheme();
  }

  toggleTheme(): void {
    this.isDarkMode = !this.isDarkMode;
    localStorage.setItem('theme', this.isDarkMode ? 'dark' : 'light');
    this.applyTheme();
  }

  private applyTheme(): void {
    if (this.isDarkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
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
      }
    });
  }

  loadNotifications(): void {
    this.notificationService.getNotifications().subscribe({
      next: (response: any) => {
        if (response && Array.isArray(response.data)) {
          this.notifications = response.data;
          this.updateUnreadCount();
        } else {
          console.warn('Invalid notifications response structure:', response);
          this.notifications = [];
          Swal.fire({
            icon: 'warning',
            title: 'Avertissement',
            text: 'Aucune notification disponible ou structure de réponse invalide.'
          });
        }
      },
      error: (error) => {
        console.error('Error fetching notifications:', error);
      }
    });
  }

  markNotificationAsRead(notificationId: number): void {
    this.notificationService.markAsRead([notificationId]).subscribe({
      next: (response: any) => {
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
        this.notifications.forEach(n => (n.is_read = true));
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
        localStorage.removeItem('theme');
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