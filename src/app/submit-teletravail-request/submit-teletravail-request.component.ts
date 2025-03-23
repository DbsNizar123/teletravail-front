import { Component, OnInit } from '@angular/core';
import { TeletravailRequestService } from '../services/teletravail-request.service';
import { DepartmentService } from '../services/department.service'; // Importez le service DepartmentService
import Swal from 'sweetalert2';

@Component({
  selector: 'app-submit-teletravail-request',
  templateUrl: './submit-teletravail-request.component.html',
})
export class SubmitTeletravailRequestComponent implements OnInit {
  // Déclaration des données du formulaire
  requestData = {
    date: '',
    reason: '',
    department_id: 0, // Initialisé à 0 (valeur par défaut)
  };

  departments: any[] = []; // Liste des départements

  constructor(
    private teletravailRequestService: TeletravailRequestService,
    private departmentService: DepartmentService // Injectez le service DepartmentService
  ) {}

  ngOnInit(): void {
    this.loadDepartments(); // Chargez les départements au démarrage
  }

  // Charger la liste des départements
  loadDepartments(): void {
    this.departmentService.getAllDepartments().subscribe({
      next: (departments) => {
        this.departments = departments; // Tous les départements sont chargés
      },
      error: (error) => {
        console.error('Erreur lors du chargement des départements :', error);
        Swal.fire({
          icon: 'error',
          title: 'Erreur...',
          text: 'Échec du chargement des départements.',
        });
      },
    });
  }

  // Soumettre la demande de télétravail
  onSubmit() {
    // Valider que department_id est défini
    if (this.requestData.department_id === 0) {
      Swal.fire({
        icon: 'error',
        title: 'Erreur...',
        text: 'Veuillez sélectionner un département.',
      });
      return; // Arrêter l'exécution si department_id n'est pas défini
    }

    // Soumettre la demande de télétravail
    this.teletravailRequestService.submitRequest(this.requestData).subscribe({
      next: (response) => {
        Swal.fire({
          icon: 'success',
          title: 'Succès!',
          text: 'Demande soumise avec succès !',
        });
        console.log(response);
        this.resetForm(); // Réinitialiser le formulaire après la soumission
      },
      error: (error) => {
        Swal.fire({
          icon: 'error',
          title: 'Erreur...',
          text: 'Erreur lors de la soumission de la demande.',
        });
        console.error(error);
      },
    });
  }

  // Réinitialiser le formulaire
  resetForm(): void {
    this.requestData = {
      date: '',
      reason: '',
      department_id: 0, // Réinitialiser à 0
    };
  }
}