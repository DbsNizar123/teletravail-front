import { Component, OnInit } from '@angular/core';
import { GlobalSettingService } from '../services/global-setting.service';
import Swal from 'sweetalert2';
import { CalendarOptions, EventApi, DateSelectArg, EventClickArg } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import frLocale from '@fullcalendar/core/locales/fr';

interface ExtendedProps {
  id?: string;
  description?: string;
  status: string;
  daily_limit?: number | null;
  isDefault?: boolean;
}

interface CalendarEvent {
  id?: string;
  title: string;
  date: string;
  allDay: boolean;
  backgroundColor: string;
  borderColor: string;
  textColor: string;
  extendedProps: ExtendedProps;
}

@Component({
  selector: 'app-global-settings-calendar',
  templateUrl: './global-settings-calendar.component.html',
  styleUrls: ['./global-settings-calendar.component.css']
})
export class GlobalSettingsCalendarComponent implements OnInit {
  optionsCalendrier: CalendarOptions = {
    plugins: [dayGridPlugin, interactionPlugin, timeGridPlugin, listPlugin],
    initialView: 'dayGridMonth',
    locale: frLocale,
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,dayGridWeek,dayGridDay,listWeek'
    },
    buttonText: {
      today: 'Aujourd\'hui',
      month: 'Mois',
      week: 'Semaine',
      day: 'Jour',
      list: 'Liste'
    },
    allDayText: 'Toute la journée',
    noEventsText: 'Aucun événement à afficher',
    editable: true,
    selectable: true,
    selectMirror: true,
    dayMaxEvents: true,
    weekends: true,
    events: [],
    eventClick: this.gestionClicEvenement.bind(this),
    select: this.gestionSelectionDate.bind(this),
    eventDisplay: 'block',
    allDaySlot: false,
    slotMinTime: '00:00:00',
    slotMaxTime: '24:00:00',
    defaultAllDay: true,
    views: {
      dayGridMonth: {
      },
      dayGridWeek: {
        type: 'dayGrid',
        duration: { weeks: 1 },
        titleFormat: { year: 'numeric', month: 'short', day: 'numeric' }
      },
      dayGridDay: {
        type: 'dayGrid',
        duration: { days: 1 },
        titleFormat: { year: 'numeric', month: 'short', day: 'numeric', weekday: 'long' }
      }
    }
  };

  evenementsActuels: EventApi[] = [];

  constructor(private serviceParametres: GlobalSettingService) {}

  ngOnInit(): void {
    this.initializeCalendarWithAvailableDays();
    this.chargerParametres();
  }

  initializeCalendarWithAvailableDays(): void {
    const startDate = new Date('2025-01-01');
    const endDate = new Date('2025-12-31');
    const defaultEvents: CalendarEvent[] = [];
    
    for (let date = new Date(startDate); date <= endDate; date.setDate(date.getDate() + 1)) {
      const dayOfWeek = date.getDay();
      const formattedDate = this.formaterDate(date.toISOString());
      
      if (dayOfWeek === 0 || dayOfWeek === 6) {
        continue;
      }
      
      defaultEvents.push({
        title: '✅ Télétravail autorisé',
        date: formattedDate,
        allDay: true,
        backgroundColor: '#00C851',
        borderColor: '#007E33',
        textColor: '#ffffff',
        extendedProps: {
          status: 'available',
          daily_limit: null,
          description: 'Disponible par défaut',
          isDefault: true
        }
      });
    }
    
    this.optionsCalendrier.events = defaultEvents;
  }

  chargerParametres(): void {
    this.serviceParametres.getSettings().subscribe({
      next: (parametres: any[]) => {
        const existingEvents = this.optionsCalendrier.events as CalendarEvent[];
        const updatedEvents = existingEvents.map(event => {
          const override = parametres.find((p: any) => 
            this.formaterDate(p.date) === event.date
          );
          
          if (override) {
            return {
              id: override.id,
              title: this.genererTitreEvenement(override),
              date: this.formaterDate(override.date),
              allDay: true,
              backgroundColor: this.getCouleurFond(override.status),
              borderColor: this.getCouleurBordure(override.status),
              textColor: '#ffffff',
              extendedProps: {
                id: override.id,
                description: override.description,
                status: override.status,
                daily_limit: override.daily_limit,
                isDefault: false
              }
            };
          }
          return event;
        });
        
        this.optionsCalendrier.events = updatedEvents;
      },
      error: (erreur) => {
        console.error('Erreur de chargement:', erreur);
        this.afficherErreur('Erreur', `Impossible de charger les paramètres: ${erreur.message}`);
      }
    });
  }

  genererTitreEvenement(parametre: { status: string; daily_limit?: number | null }): string {
    switch(parametre.status) {
      case 'blocked': 
        return '🚫 Jour bloqué';
      case 'limited': 
        return `⚠️ Limité (${parametre.daily_limit}% de télétravail)`;
      case 'available': 
        return '✅ Télétravail autorisé';
      default: 
        return '❓ Statut inconnu';
    }
  }

  formaterDate(date: string): string {
    return new Date(date).toISOString().split('T')[0];
  }

  getCouleurFond(statut: string): string {
    switch (statut) {
      case 'blocked': return '#ff4444';
      case 'limited': return '#ffbb33';
      case 'available': return '#00C851';
      default: return '#2BBBAD';
    }
  }

  getCouleurBordure(statut: string): string {
    switch (statut) {
      case 'blocked': return '#CC0000';
      case 'limited': return '#FF8800';
      case 'available': return '#007E33';
      default: return '#00695c';
    }
  }

  gestionSelectionDate(infoSelection: DateSelectArg): void {
    const dateFormatee = this.formaterDate(infoSelection.startStr);
    const existingEvents = this.optionsCalendrier.events as CalendarEvent[];
    const existingEvent = existingEvents.find(e => e.date === dateFormatee);

    Swal.fire({
      title: existingEvent?.extendedProps.isDefault ? 'Modifier la disponibilité' : 'Ajouter un paramètre',
      html: this.genererFormulaireAjout(dateFormatee),
      didOpen: () => this.configurerEcouteurStatut(),
      showCancelButton: true,
      confirmButtonText: 'Modifier',
      cancelButtonText: 'Annuler',
      confirmButtonColor: '#3f51b5',
      cancelButtonColor: '#ff4444',
      preConfirm: () => this.recupererDonneesFormulaire(dateFormatee)
    }).then((resultat) => {
      if (resultat.isConfirmed && resultat.value) {
        this.serviceParametres.addSetting(resultat.value).subscribe({
          next: () => {
            this.afficherSucces('Succès', `Paramètre mis à jour pour ${dateFormatee}`);
            this.chargerParametres();
          },
          error: (erreur) => {
            this.afficherErreur('Erreur', `Échec de la mise à jour: ${erreur.error?.message || erreur.message}`);
          }
        });
      }
    });
  }

  genererFormulaireAjout(date: string): string {
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

  configurerEcouteurStatut(): void {
    const selecteurStatut = document.getElementById('status') as HTMLSelectElement;
    const groupeLimite = document.getElementById('limit-group') as HTMLDivElement;

    selecteurStatut.addEventListener('change', () => {
      groupeLimite.style.display = selecteurStatut.value === 'limited' ? 'block' : 'none';
    });
  }

  recupererDonneesFormulaire(dateFormatee: string): any {
    const statut = (document.getElementById('status') as HTMLSelectElement).value;
    const limiteQuotidienne = (document.getElementById('daily_limit') as HTMLInputElement).value;
    const description = (document.getElementById('description') as HTMLTextAreaElement).value;

    if (statut === 'limited' && (!limiteQuotidienne || +limiteQuotidienne < 1 || +limiteQuotidienne > 100)) {
      Swal.showValidationMessage('Veuillez entrer une limite valide (1-100%)');
      return false;
    }

    return {
      date: dateFormatee,
      status: statut,
      daily_limit: statut === 'limited' ? limiteQuotidienne : null,
      description: description || 'Aucune description fournie'
    };
  }

  gestionClicEvenement(infoClic: EventClickArg): void {
    const evenement = infoClic.event;
    const parametre = evenement.extendedProps as ExtendedProps;
    const date = this.formaterDate(evenement.startStr);

    Swal.fire({
      title: parametre.isDefault ? 'Modifier la disponibilité' : 'Gérer le paramètre',
      html: this.genererFormulaireEdition(parametre, date),
      didOpen: () => {
        this.configurerEcouteurStatut();
        if (parametre.status === 'limited') {
          (document.getElementById('limit-group') as HTMLDivElement).style.display = 'block';
        }
      },
      showCancelButton: true,
      confirmButtonText: 'Modifier',
      showDenyButton: !parametre.isDefault,
      denyButtonText: 'Supprimer',
      confirmButtonColor: '#3f51b5',
      cancelButtonColor: '#ff4444',
      denyButtonColor: '#ff4444',
      preConfirm: () => this.recupererDonneesFormulaireEdition(parametre, date)
    }).then((resultat) => {
      if (resultat.isConfirmed && resultat.value) {
        const action = parametre.isDefault ? 
          this.serviceParametres.addSetting(resultat.value) :
          this.serviceParametres.updateSetting(parametre.id!, resultat.value);
          
        action.subscribe({
          next: () => {
            this.afficherSucces('Succès', 'Paramètre mis à jour avec succès');
            this.chargerParametres();
          },
          error: (erreur) => {
            this.afficherErreur('Erreur', `Échec de la mise à jour: ${erreur.error?.message || erreur.message}`);
          }
        });
      } else if (resultat.isDenied) {
        this.supprimerParametre(parametre.id!, date);
      }
    });
  }

  genererFormulaireEdition(parametre: ExtendedProps, date: string): string {
    return `
      <div class="form-group mb-3">
        <label class="form-label">Date</label>
        <input type="text" id="date" class="form-control" value="${date}" readonly>
      </div>
      <div class="form-group mb-3">
        <label class="form-label">Statut</label>
        <select id="status" class="form-select">
          <option value="blocked" ${parametre.status === 'blocked' ? 'selected' : ''}>Bloqué</option>
          <option value="limited" ${parametre.status === 'limited' ? 'selected' : ''}>Limité</option>
          <option value="available" ${parametre.status === 'available' ? 'selected' : ''}>Disponible</option>
        </select>
      </div>
      <div class="form-group mb-3" id="limit-group" style="display:${parametre.status === 'limited' ? 'block' : 'none'}">
        <label class="form-label">Limite quotidienne (%)</label>
        <input type="number" id="daily_limit" class="form-control" 
               placeholder="1-100" min="1" max="100" 
               value="${parametre.daily_limit || ''}">
      </div>
      <div class="form-group mb-3">
        <label class="form-label">Description</label>
        <textarea id="description" class="form-control" 
                  placeholder="Raison du paramètre">${parametre.description || ''}</textarea>
      </div>
    `;
  }

  recupererDonneesFormulaireEdition(parametre: ExtendedProps, date: string): any {
    const statut = (document.getElementById('status') as HTMLSelectElement).value;
    const limiteQuotidienne = (document.getElementById('daily_limit') as HTMLInputElement).value;
    const description = (document.getElementById('description') as HTMLTextAreaElement).value;

    if (statut === 'limited' && (!limiteQuotidienne || +limiteQuotidienne < 1 || +limiteQuotidienne > 100)) {
      Swal.showValidationMessage('Veuillez entrer une limite valide (1-100%)');
      return false;
    }

    return {
      id: parametre.id,
      date,
      status: statut,
      daily_limit: statut === 'limited' ? limiteQuotidienne : null,
      description: description || 'Aucune description fournie'
    };
  }

  supprimerParametre(id: string, date: string): void {
    Swal.fire({
      title: 'Confirmer la suppression',
      text: `Voulez-vous vraiment supprimer le paramètre pour ${date} ?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Oui, supprimer',
      cancelButtonText: 'Annuler',
      confirmButtonColor: '#ff4444',
      cancelButtonColor: '#3f51b5'
    }).then((resultat) => {
      if (resultat.isConfirmed) {
        this.serviceParametres.deleteSetting(id).subscribe({
          next: () => {
            this.afficherSucces('Supprimé!', 'Le paramètre a été supprimé.');
            this.chargerParametres();
          },
          error: (erreur) => {
            this.afficherErreur('Erreur', `Échec de la suppression: ${erreur.error?.message || erreur.message}`);
          }
        });
      }
    });
  }

  afficherSucces(titre: string, message: string): void {
    Swal.fire({
      icon: 'success',
      title: titre,
      text: message,
      confirmButtonColor: '#3f51b5'
    });
  }

  afficherErreur(titre: string, message: string): void {
    Swal.fire({
      icon: 'error',
      title: titre,
      text: message,
      confirmButtonColor: '#3f51b5'
    });
  }
}