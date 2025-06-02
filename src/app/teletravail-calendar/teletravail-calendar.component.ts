import { Component, OnInit } from '@angular/core';
import { TeletravailRequestService } from '../services/teletravail-request.service';
import { CalendarOptions, EventClickArg } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import frLocale from '@fullcalendar/core/locales/fr';
import Swal from 'sweetalert2';

type RequestStatus = 'pending' | 'approved' | 'rejected';

interface TeletravailRequest {
  id: string;
  date: string;
  status: RequestStatus;
  reason: string;
  user: {
    name: string;
    department?: {
      name: string;
    };
  };
}

@Component({
  selector: 'app-teletravail-calendar',
  templateUrl: './teletravail-calendar.component.html',
  styleUrls: ['./teletravail-calendar.component.css']
})
export class TeletravailCalendarComponent implements OnInit {
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
    dayCellContent: this.renderDayCellContent.bind(this),
  };

  requests: TeletravailRequest[] = [];
  isLoading: boolean = true;

  constructor(private teletravailService: TeletravailRequestService) {}

  ngOnInit(): void {
    this.loadRequests();
  }

  loadRequests(): void {
    this.isLoading = true;
    this.teletravailService.getAllRequestss().subscribe({
      next: (response: { data: TeletravailRequest[] }) => {
        this.requests = response.data;
        const events = this.requests.map((request: TeletravailRequest) => ({
          id: request.id.toString(),
          title: this.getEventTitle(request),
          date: request.date,
          backgroundColor: this.getEventColor(request.status),
          borderColor: this.getBorderColor(request.status),
          classNames: [request.status],
          extendedProps: {
            status: request.status,
            reason: request.reason,
            user_name: request.user.name,
            user_department: request.user.department?.name || 'Non spécifié'
          }
        }));
        this.calendarOptions.events = events;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading requests:', error);
        this.isLoading = false;
        Swal.fire({
          title: 'Erreur',
          text: 'Impossible de charger les demandes. Veuillez réessayer.',
          icon: 'error',
          confirmButtonColor: '#3f51b5'
        });
      }
    });
  }

  renderDayCellContent(arg: any): any {
    const container = document.createElement('div');
    container.className = 'fc-daygrid-day-top';

    const dayNumber = document.createElement('span');
    dayNumber.className = 'fc-daygrid-day-number';
    dayNumber.innerText = arg.dayNumberText.replace('日', '');
    container.appendChild(dayNumber);

    return { domNodes: [container] };
  }

  handleEventClick(clickInfo: EventClickArg): void {
    const event = clickInfo.event;
    const request = event.extendedProps as {
      status: RequestStatus;
      reason: string;
      user_name: string;
      user_department: string;
    };
    
    const detailsHtml = `
      <div class="text-start">
        <p><strong>Date:</strong> ${event.startStr}</p>
        <p><strong>Employé:</strong> ${request.user_name}</p>
        <p><strong>Département:</strong> ${request.user_department}</p>
        <p><strong>Statut:</strong> ${this.getStatusText(request.status)}</p>
        <p><strong>Raison:</strong> ${request.reason}</p>
      </div>
    `;

    Swal.fire({
      title: 'Détails de la demande',
      html: detailsHtml,
      icon: 'info',
      confirmButtonText: 'Fermer',
      confirmButtonColor: '#3f51b5',
      customClass: {
        popup: 'swal-wide',
      },
    });
  }

  getEventTitle(request: TeletravailRequest): string {
    return request.user.name;
  }

  getStatusText(status: RequestStatus): string {
    const statusTexts: Record<RequestStatus, string> = {
      pending: 'En attente',
      approved: 'Approuvé',
      rejected: 'Rejeté'
    };
    return statusTexts[status];
  }

  getEventColor(status: RequestStatus): string {
    const colors: Record<RequestStatus, string> = {
      pending: '#ffbb33',
      approved: '#00C851',
      rejected: '#ff4444'
    };
    return colors[status];
  }

  getBorderColor(status: RequestStatus): string {
    const colors: Record<RequestStatus, string> = {
      pending: '#ff8800',
      approved: '#007E33',
      rejected: '#cc0000'
    };
    return colors[status];
  }
}