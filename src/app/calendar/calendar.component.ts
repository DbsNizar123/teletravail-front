import { Component, OnInit } from '@angular/core';
import { GlobalSettingService } from '../services/global-setting.service';
import Swal from 'sweetalert2';
import { CalendarOptions, EventClickArg, EventApi } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import frLocale from '@fullcalendar/core/locales/fr';

interface CalendarSetting {
  id?: string; // Made optional for default events
  date: string;
  status: 'blocked' | 'limited' | 'available';
  daily_limit?: number | null;
  description?: string;
  isDefault?: boolean; // Added to distinguish default events
}

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css'],
})
export class CalendarComponent implements OnInit {
  calendarOptions: CalendarOptions = {
    plugins: [dayGridPlugin, interactionPlugin],
    initialView: 'dayGridMonth',
    locale: frLocale,
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: ''
    },
    events: [],
    eventClick: this.handleEventClick.bind(this),
    eventDisplay: 'block',
    eventTextColor: '#ffffff',
    eventBorderColor: '#ffffff',
    eventTimeFormat: {
      hour: '2-digit',
      minute: '2-digit',
      meridiem: false
    }
  };

  constructor(private globalSettingService: GlobalSettingService) {}

  ngOnInit(): void {
    this.initializeCalendarWithAvailableDays();
    this.loadSettings();
  }

  initializeCalendarWithAvailableDays(): void {
    const startDate = new Date('2025-01-01');
    const endDate = new Date('2025-12-31');
    const defaultEvents: CalendarSetting[] = [];
  
    for (let date = new Date(startDate); date <= endDate; date.setDate(date.getDate() + 1)) {
      const dayOfWeek = date.getDay(); // 0 = Sunday, 6 = Saturday
      if (dayOfWeek === 0 || dayOfWeek === 6) {
        continue; // Skip Saturdays and Sundays
      }
      const formattedDate = this.formatDate(date.toISOString());
      defaultEvents.push({
        date: formattedDate,
        status: 'available',
        description: 'Disponible par défaut',
        isDefault: true
      });
    }
  
    this.calendarOptions.events = defaultEvents.map(setting => ({
      title: this.getEventTitle(setting),
      date: setting.date,
      backgroundColor: this.getEventColor(setting.status),
      borderColor: this.getBorderColor(setting.status),
      extendedProps: { ...setting }
    }));
  }

  loadSettings(): void {
    this.globalSettingService.getSettings().subscribe({
      next: (settings: CalendarSetting[]) => {
        const existingEvents = this.calendarOptions.events as any[];
        const updatedEvents = existingEvents.map(event => {
          const setting = settings.find(s => this.formatDate(s.date) === event.date);
          if (setting) {
            return {
              title: this.getEventTitle(setting),
              date: this.formatDate(setting.date),
              backgroundColor: this.getEventColor(setting.status),
              borderColor: this.getBorderColor(setting.status),
              extendedProps: { ...setting, isDefault: false }
            };
          }
          return event;
        });
        this.calendarOptions.events = updatedEvents;
      },
      error: (error) => {
        console.error('Error loading settings:', error);
      }
    });
  }

  handleEventClick(clickInfo: EventClickArg): void {
    const event = clickInfo.event;
    const setting = event.extendedProps as CalendarSetting;
  
    // Format the date
    const formattedDate = this.formatDate(event.startStr);
  
    // Prepare the details HTML
    const detailsHtml = `
      <div class="text-start">
        <p><strong>Date:</strong> ${formattedDate}</p>
        <p><strong>Statut:</strong> ${this.getEventTitle(setting)}</p>
        ${
          setting.status === 'limited' && setting.daily_limit
            ? `<p><strong>Limite quotidienne:</strong> ${setting.daily_limit}%</p>`
            : ''
        }
        <p><strong>Description:</strong> ${setting.description || 'Aucune description'}</p>
        ${
          setting.isDefault
            ? '<p><em></em></p>'
            : '<p><em></em></p>'
        }
      </div>
    `;
  
    // Show the details in a SweetAlert2 popup
    Swal.fire({
      title: 'Détails de l’événement',
      html: detailsHtml,
      icon: 'info',
      confirmButtonText: 'Fermer',
      confirmButtonColor: '#3f51b5',
      customClass: {
        popup: 'swal-wide',
      },
    });
  }

  getEventTitle(setting: CalendarSetting): string {
    const icons = {
      blocked: '🚫',
      limited: '⚠️',
      available: '✅'
    };
    return `${icons[setting.status]} ${setting.status === 'limited' 
      ? `Limité (${setting.daily_limit}%)` 
      : setting.status === 'blocked' 
        ? 'Bloqué' 
        : 'Disponible'}`;
  }

  formatDate(date: string): string {
    return new Date(date).toISOString().split('T')[0];
  }

  getEventColor(status: 'blocked' | 'limited' | 'available'): string {
    const colors = {
      blocked: '#ff4444',
      limited: '#ffbb33',
      available: '#00C851'
    };
    return colors[status];
  }

  getBorderColor(status: 'blocked' | 'limited' | 'available'): string {
    const colors = {
      blocked: '#cc0000',
      limited: '#ff8800',
      available: '#007E33'
    };
    return colors[status];
  }


  generateEditForm(setting: CalendarSetting, date: string): string {
    return `
      <div class="text-start">
        <div class="mb-3">
          <label class="form-label">Date</label>
          <input type="text" id="date" class="form-control" value="${date}" readonly>
        </div>
        <div class="mb-3">
          <label class="form-label">Statut</label>
          <select id="status" class="form-select">
            <option value="blocked" ${setting.status === 'blocked' ? 'selected' : ''}>Bloqué</option>
            <option value="limited" ${setting.status === 'limited' ? 'selected' : ''}>Limité</option>
            <option value="available" ${setting.status === 'available' ? 'selected' : ''}>Disponible</option>
          </select>
        </div>
        <div class="mb-3" id="limit-group" style="display: ${setting.status === 'limited' ? 'block' : 'none'}">
          <label class="form-label">Limite quotidienne (%)</label>
          <input type="number" id="daily_limit" class="form-control" 
                 value="${setting.daily_limit || ''}" min="1" max="100" placeholder="1-100">
        </div>
        <div class="mb-3">
          <label class="form-label">Description</label>
          <textarea id="description" class="form-control">${setting.description || ''}</textarea>
        </div>
      </div>
    `;
  }

  setupStatusListener(): void {
    const statusSelect = document.getElementById('status') as HTMLSelectElement;
    const limitGroup = document.getElementById('limit-group') as HTMLDivElement;

    statusSelect.addEventListener('change', () => {
      limitGroup.style.display = statusSelect.value === 'limited' ? 'block' : 'none';
    });
  }

  getFormData(setting: CalendarSetting, date: string): any {
    const status = (document.getElementById('status') as HTMLSelectElement).value as 'blocked' | 'limited' | 'available';
    const dailyLimit = (document.getElementById('daily_limit') as HTMLInputElement).value;
    const description = (document.getElementById('description') as HTMLTextAreaElement).value;

    if (status === 'limited' && (!dailyLimit || +dailyLimit < 1 || +dailyLimit > 100)) {
      Swal.showValidationMessage('Veuillez entrer une limite valide (1-100%)');
      return false;
    }

    return {
      date,
      status,
      daily_limit: status === 'limited' ? +dailyLimit : null,
      description: description || 'Aucune description'
    };
  }

  deleteSetting(id: string, date: string): void {
    Swal.fire({
      title: 'Confirmer la suppression',
      text: `Voulez-vous vraiment supprimer le paramètre pour ${date}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Oui, supprimer',
      cancelButtonText: 'Annuler',
      confirmButtonColor: '#ff4444',
      cancelButtonColor: '#3f51b5'
    }).then((result) => {
      if (result.isConfirmed) {
        this.globalSettingService.deleteSetting(id).subscribe({
          next: () => {
            this.showSuccess('Supprimé', 'Le paramètre a été supprimé');
            this.loadSettings();
          },
          error: (error) => {
            this.showError('Erreur', `Échec de la suppression: ${error.message}`);
          }
        });
      }
    });
  }

  showSuccess(title: string, message: string): void {
    Swal.fire({
      icon: 'success',
      title,
      text: message,
      confirmButtonColor: '#3f51b5'
    });
  }

  showError(title: string, message: string): void {
    Swal.fire({
      icon: 'error',
      title,
      text: message,
      confirmButtonColor: '#3f51b5'
    });
  }
}