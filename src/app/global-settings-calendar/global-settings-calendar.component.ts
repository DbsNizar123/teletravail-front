import { Component, OnInit } from '@angular/core';
import { GlobalSettingService } from '../services/global-setting.service';
import Swal from 'sweetalert2';
import { CalendarOptions, EventApi, DateSelectArg, EventClickArg } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import frLocale from '@fullcalendar/core/locales/fr';

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
      right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek'
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
    eventTimeFormat: {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    }
  };

  evenementsActuels: EventApi[] = [];

  constructor(private serviceParametres: GlobalSettingService) {}

  ngOnInit(): void {
    this.chargerParametres();
  }

  chargerParametres(): void {
    this.serviceParametres.getSettings().subscribe({
      next: (parametres) => {
        this.optionsCalendrier.events = parametres.map((parametre: any) => ({
          id: parametre.id,
          title: this.genererTitreEvenement(parametre),
          date: this.formaterDate(parametre.date),
          allDay: true,
          backgroundColor: this.getCouleurFond(parametre.status),
          borderColor: this.getCouleurBordure(parametre.status),
          textColor: '#ffffff',
          extendedProps: { 
            id: parametre.id, 
            description: parametre.description,
            status: parametre.status,
            daily_limit: parametre.daily_limit
          },
        }));
      },
      error: (erreur) => {
        console.error('Erreur de chargement:', erreur);
        this.afficherErreur('Erreur', `Impossible de charger les paramètres: ${erreur.message}`);
      },
    });
  }

  genererTitreEvenement(parametre: any): string {
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
    
    Swal.fire({
      title: 'Ajouter un paramètre',
      html: this.genererFormulaireAjout(dateFormatee),
      didOpen: () => this.configurerEcouteurStatut(),
      showCancelButton: true,
      confirmButtonText: 'Ajouter',
      cancelButtonText: 'Annuler',
      confirmButtonColor: '#3f51b5',
      cancelButtonColor: '#ff4444',
      preConfirm: () => this.recupererDonneesFormulaire(dateFormatee)
    }).then((resultat) => {
      if (resultat.isConfirmed && resultat.value) {
        this.serviceParametres.addSetting(resultat.value).subscribe({
          next: () => {
            this.afficherSucces('Succès', `Paramètre ajouté pour ${dateFormatee}`);
            this.chargerParametres();
          },
          error: (erreur) => {
            this.afficherErreur('Erreur', `Échec de l'ajout: ${erreur.error?.message || erreur.message}`);
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
    const parametre = evenement.extendedProps;
    const date = this.formaterDate(evenement.startStr);

    Swal.fire({
      title: 'Gérer le paramètre',
      html: this.genererFormulaireEdition(parametre, date),
      didOpen: () => {
        this.configurerEcouteurStatut();
        if (parametre['status'] === 'limited') {
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
      preConfirm: () => this.recupererDonneesFormulaireEdition(parametre, date)
    }).then((resultat) => {
      if (resultat.isConfirmed && resultat.value) {
        this.modifierParametre(resultat.value);
      } else if (resultat.isDenied) {
        this.supprimerParametre(parametre['id'], date);
      }
    });
  }

  genererFormulaireEdition(parametre: any, date: string): string {
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

  recupererDonneesFormulaireEdition(parametre: any, date: string): any {
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

  modifierParametre(donneesParametre: any): void {
    this.serviceParametres.updateSetting(donneesParametre.id, donneesParametre).subscribe({
      next: () => {
        this.afficherSucces('Succès', 'Paramètre mis à jour avec succès');
        this.chargerParametres();
      },
      error: (erreur) => {
        this.afficherErreur('Erreur', `Échec de la mise à jour: ${erreur.error?.message || erreur.message}`);
      }
    });
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