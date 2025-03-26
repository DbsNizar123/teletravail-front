import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DepartmentService } from '../services/department.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-department-update',
  templateUrl: './department-update.component.html',
  styleUrls: ['./department-update.component.css'],
})
export class DepartmentUpdateComponent implements OnInit {
  department: { name: string; description: string } = { name: '', description: '' };
  departmentId!: string;
  errorMessage: string | null = null;
  successMessage: string | null = null;
  submitted: boolean = false; // To track if the form is submitted

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private departmentService: DepartmentService
  ) {}

  ngOnInit(): void {
    this.departmentId = this.route.snapshot.paramMap.get('id') || ''; // Récupérer l'ID depuis l'URL
    this.loadDepartmentDetails();
  }

  // Charger les détails du département existant
  loadDepartmentDetails(): void {
    if (this.departmentId) {
      this.departmentService.getDepartmentById(this.departmentId).subscribe({
        next: (response) => {
          this.department = {
            name: response.department.name,
            description: response.department.description || '', // Ensure description is a string
          };
        },
        error: (err) => {
          console.error('Error loading department details:', err);
          this.errorMessage = 'Échec du chargement des détails du département.';
        },
      });
    }
  }

  // Mettre à jour le département
  onSubmit(): void {
    this.submitted = true; // Mark the form as submitted
    if (this.department.name) { // Basic validation
      this.departmentService.updateDepartment(this.departmentId, this.department).subscribe({
        next: () => {
          // Afficher une SweetAlert de succès
          Swal.fire({
            icon: 'success',
            title: 'Succès !',
            text: 'Le département a été mis à jour avec succès.',
            confirmButtonText: 'OK',
          }).then((result) => {
            if (result.isConfirmed) {
              // Rediriger vers la liste des départements après avoir cliqué sur "OK"
              this.router.navigate(['/admin/show-department']);
            }
          });
        },
        error: (err) => {
          console.error('Erreur lors de la mise à jour du département :', err);
          this.errorMessage = 'Échec de la mise à jour du département.';
        },
      });
    }
  }

  // Annuler et retourner à la liste des départements
  cancel(): void {
    this.router.navigate(['/departments']);
  }
}