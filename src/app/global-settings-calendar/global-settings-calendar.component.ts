import { Component, OnInit } from '@angular/core';
import { GlobalSettingService } from '../services/global-setting.service';
import Swal from 'sweetalert2';
import { CalendarOptions, EventApi, DateSelectArg, EventClickArg } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import  frLocale  from '@fullcalendar/core/locales/fr';

@Component({
  selector: 'app-global-settings-calendar',
  templateUrl: './global-settings-calendar.component.html',
  styleUrls: ['./global-settings-calendar.component.css']
})
export class GlobalSettingsCalendarComponent implements OnInit {
  calendarOptions: CalendarOptions = {
    plugins: [dayGridPlugin, interactionPlugin, timeGridPlugin, listPlugin],
    initialView: 'dayGridMonth',
    locale: frLocale,
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek'
    },
    editable: true,
    selectable: true,
    selectMirror: true,
    dayMaxEvents: true,
    weekends: true,
    events: [],
    eventClick: this.handleEventClick.bind(this),
    select: this.handleDateSelect.bind(this),
    eventDisplay: 'block',
    eventTimeFormat: {
      hour: '2-digit',
      minute: '2-digit',
      meridiem: false
    }
  };

  currentEvents: EventApi[] = [];

  constructor(private globalSettingService: GlobalSettingService) {}

  ngOnInit(): void {
    this.loadSettings();
  }

  loadSettings(): void {
    this.globalSettingService.getSettings().subscribe({
      next: (settings) => {
        this.calendarOptions.events = settings.map((setting: any) => ({
          id: setting.id,
          title: this.getEventTitle(setting),
          date: this.formatDate(setting.date),
          allDay: true,
          backgroundColor: this.getEventColor(setting.status),
          borderColor: this.getBorderColor(setting.status),
          textColor: '#ffffff',
          extendedProps: { 
            id: setting.id, 
            description: setting.description,
            status: setting.status,
            daily_limit: setting.daily_limit
          },
        }));
      },
      error: (error) => {
        console.error('Error loading settings:', error);
        Swal.fire({
          icon: 'error',
          title: 'Erreur',
          text: `Impossible de charger les paramètres: ${error.message}`,
          confirmButtonColor: '#3f51b5'
        });
      },
    });
  }

  getEventTitle(setting: any): string {
    switch(setting.status) {
      case 'blocked': 
        return '🚫 Bloqué';
      case 'limited': 
        return `⚠️ Limité (${setting.daily_limit}%)`;
      case 'available': 
        return '✅ Disponible';
      default: 
        return '❓ Inconnu';
    }
  }

  formatDate(date: string): string {
    return new Date(date).toISOString().split('T')[0];
  }

  getEventColor(status: string): string {
    switch (status) {
      case 'blocked': return '#ff4444';
      case 'limited': return '#ffbb33';
      case 'available': return '#00C851';
      default: return '#2BBBAD';
    }
  }

  getBorderColor(status: string): string {
    switch (status) {
      case 'blocked': return '#CC0000';
      case 'limited': return '#FF8800';
      case 'available': return '#007E33';
      default: return '#00695c';
    }
  }

  handleDateSelect(selectInfo: DateSelectArg): void {
    const formattedDate = this.formatDate(selectInfo.startStr);
    
    Swal.fire({
      title: 'Ajouter un paramètre',
      html: this.getDateFormHtml(formattedDate),
      didOpen: () => this.setupStatusChangeListener(),
      showCancelButton: true,
      confirmButtonText: 'Ajouter',
      cancelButtonText: 'Annuler',
      confirmButtonColor: '#3f51b5',
      cancelButtonColor: '#ff4444',
      preConfirm: () => this.collectFormData(formattedDate)
    }).then((result) => {
      if (result.isConfirmed && result.value) {
        this.globalSettingService.addSetting(result.value).subscribe({
          next: () => {
            Swal.fire({
              icon: 'success',
              title: 'Succès',
              text: `Paramètre ajouté pour ${formattedDate}`,
              confirmButtonColor: '#3f51b5'
            });
            this.loadSettings();
          },
          error: (error) => {
            Swal.fire({
              icon: 'error',
              title: 'Erreur',
              text: `Échec de l'ajout: ${error.error?.message || error.message}`,
              confirmButtonColor: '#3f51b5'
            });
          }
        });
      }
    });
  }

  getDateFormHtml(date: string): string {
    return `
      <div class="form-group mb-3">
        <label class="form-label">Date</label>
        <input type="text" id="date" class="form-control" value="${date}" readonly>
      </div>
      <div class="form-group mb-3">
        <label class="form-label">Statut</label>
        <select id="status" class="form-select">
          <option value="blocked">Bloqué</option>
          <option value="limited">Limité</option>
          <option value="available" selected>Disponible</option>
        </select>
      </div>
      <div class="form-group mb-3" id="limit-group" style="display:none;">
        <label class="form-label">Limite quotidienne (%)</label>
        <input type="number" id="daily_limit" class="form-control" 
               placeholder="1-100" min="1" max="100">
      </div>
      <div class="form-group mb-3">
        <label class="form-label">Description</label>
        <textarea id="description" class="form-control" 
                  placeholder="Raison du paramètre"></textarea>
      </div>
    `;
  }

  setupStatusChangeListener(): void {
    const statusSelect = document.getElementById('status') as HTMLSelectElement;
    const limitGroup = document.getElementById('limit-group') as HTMLDivElement;

    statusSelect.addEventListener('change', () => {
      limitGroup.style.display = statusSelect.value === 'limited' ? 'block' : 'none';
    });
  }

  collectFormData(formattedDate: string): any {
    const status = (document.getElementById('status') as HTMLSelectElement).value;
    const daily_limit = (document.getElementById('daily_limit') as HTMLInputElement).value;
    const description = (document.getElementById('description') as HTMLTextAreaElement).value;

    if (status === 'limited' && (!daily_limit || +daily_limit < 1 || +daily_limit > 100)) {
      Swal.showValidationMessage('Veuillez entrer une limite valide (1-100%)');
      return false;
    }

    return {
      date: formattedDate,
      status,
      daily_limit: status === 'limited' ? daily_limit : null,
      description: description || 'Aucune description fournie'
    };
  }

  handleEventClick(clickInfo: EventClickArg): void {
    const event = clickInfo.event;
    const setting = event.extendedProps;
    const date = this.formatDate(event.startStr);

    Swal.fire({
      title: 'Gérer le paramètre',
      html: this.getEditFormHtml(setting, date),
      didOpen: () => {
        this.setupStatusChangeListener();
        if (setting['status'] === 'limited') {
          (document.getElementById('limit-group') as HTMLDivElement).style.display = 'block';
        }
      },
      showCancelButton: true,
      confirmButtonText: 'Modifier',
      showDenyButton: true,
      denyButtonText: 'Supprimer',
      confirmButtonColor: '#3f51b5',
      cancelButtonColor: '#ff4444',
      denyButtonColor: '#ff4444',
      preConfirm: () => this.collectEditFormData(setting, date)
    }).then((result) => {
      if (result.isConfirmed && result.value) {
        this.editSetting(result.value);
      } else if (result.isDenied) {
        this.deleteSetting(setting['id'], date);
      }
    });
  }

  getEditFormHtml(setting: any, date: string): string {
    return `
      <div class="form-group mb-3">
        <label class="form-label">Date</label>
        <input type="text" id="date" class="form-control" value="${date}" readonly>
      </div>
      <div class="form-group mb-3">
        <label class="form-label">Statut</label>
        <select id="status" class="form-select">
          <option value="blocked" ${setting.status === 'blocked' ? 'selected' : ''}>Bloqué</option>
          <option value="limited" ${setting.status === 'limited' ? 'selected' : ''}>Limité</option>
          <option value="available" ${setting.status === 'available' ? 'selected' : ''}>Disponible</option>
        </select>
      </div>
      <div class="form-group mb-3" id="limit-group" style="display:${setting.status === 'limited' ? 'block' : 'none'}">
        <label class="form-label">Limite quotidienne (%)</label>
        <input type="number" id="daily_limit" class="form-control" 
               placeholder="1-100" min="1" max="100" 
               value="${setting.daily_limit || ''}">
      </div>
      <div class="form-group mb-3">
        <label class="form-label">Description</label>
        <textarea id="description" class="form-control" 
                  placeholder="Raison du paramètre">${setting.description || ''}</textarea>
      </div>
    `;
  }

  collectEditFormData(setting: any, date: string): any {
    const status = (document.getElementById('status') as HTMLSelectElement).value;
    const daily_limit = (document.getElementById('daily_limit') as HTMLInputElement).value;
    const description = (document.getElementById('description') as HTMLTextAreaElement).value;

    if (status === 'limited' && (!daily_limit || +daily_limit < 1 || +daily_limit > 100)) {
      Swal.showValidationMessage('Veuillez entrer une limite valide (1-100%)');
      return false;
    }

    return {
      id: setting.id,
      date,
      status,
      daily_limit: status === 'limited' ? daily_limit : null,
      description: description || 'Aucune description fournie'
    };
  }

  editSetting(settingData: any): void {
    this.globalSettingService.updateSetting(settingData.id, settingData).subscribe({
      next: () => {
        Swal.fire({
          icon: 'success',
          title: 'Succès',
          text: 'Paramètre mis à jour avec succès',
          confirmButtonColor: '#3f51b5'
        });
        this.loadSettings();
      },
      error: (error) => {
        Swal.fire({
          icon: 'error',
          title: 'Erreur',
          text: `Échec de la mise à jour: ${error.error?.message || error.message}`,
          confirmButtonColor: '#3f51b5'
        });
      }
    });
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
            Swal.fire({
              icon: 'success',
              title: 'Supprimé!',
              text: 'Le paramètre a été supprimé.',
              confirmButtonColor: '#3f51b5'
            });
            this.loadSettings();
          },
          error: (error) => {
            Swal.fire({
              icon: 'error',
              title: 'Erreur',
              text: `Échec de la suppression: ${error.error?.message || error.message}`,
              confirmButtonColor: '#3f51b5'
            });
          }
        });
      }
    });
  }
}