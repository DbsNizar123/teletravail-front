import { Component, OnInit } from '@angular/core';
import { GlobalSettingService } from '../services/global-setting.service';
import Swal from 'sweetalert2';
import { CalendarOptions, EventClickArg } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import frLocale from '@fullcalendar/core/locales/fr';

interface CalendarSetting {
  id: string;
  date: string;
  status: 'blocked' | 'limited' | 'available';
  daily_limit?: number;
  description: string;
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
    this.loadSettings();
  }

  loadSettings(): void {
    this.globalSettingService.getSettings().subscribe({
      next: (settings: CalendarSetting[]) => {
        this.calendarOptions.events = settings.map(setting => ({
          title: this.getEventTitle(setting),
          date: this.formatDate(setting.date),
          backgroundColor: this.getEventColor(setting.status),
          borderColor: this.getBorderColor(setting.status),
          extendedProps: {
            ...setting
          },
        }));
      },
      error: (error) => {
        console.error('Error loading settings:', error);
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

  handleEventClick(clickInfo: EventClickArg): void {
    const event = clickInfo.event;
    const setting = event.extendedProps as CalendarSetting;

    Swal.fire({
      title: 'Détails du jour',
      html: `
        <div class="text-start">
          <p><strong>Date:</strong> ${event.startStr}</p>
          <p><strong>Statut:</strong> ${event.title}</p>
          ${setting.daily_limit ? `<p><strong>Limite:</strong> ${setting.daily_limit}%</p>` : ''}
          <p><strong>Reason:</strong> ${setting.description || 'Aucune reason'}</p>
        </div>
      `,
      icon: 'info',
      confirmButtonText: 'Fermer',
      confirmButtonColor: '#3f51b5',
      customClass: {
        popup: 'swal-wide'
      }
    });
  }

}