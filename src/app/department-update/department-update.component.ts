import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DepartmentService } from '../services/department.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-department-update',
  templateUrl: './department-update.component.html',
  styleUrls: ['./department-update.component.css'],
})
export class DepartmentUpdateComponent implements OnInit {
  departmentForm!: FormGroup;
  departmentId!: string;
  errorMessage: string = ''; // Pour stocker les messages d'erreur
  successMessage: string = ''; // Pour stocker les messages de succès

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private departmentService: DepartmentService
  ) {}

  ngOnInit(): void {
    this.departmentId = this.route.snapshot.paramMap.get('id') || ''; // Récupérer l'ID depuis l'URL
    this.initializeForm();
    this.loadDepartmentDetails();
  }

  // Initialiser le formulaire avec des champs vides
  initializeForm(): void {
    this.departmentForm = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(255)]],
      description: [''], // Description est facultative
    });
  }

  // Charger les détails du département existant
  loadDepartmentDetails(): void {
    if (this.departmentId) {
      this.departmentService.getDepartmentById(this.departmentId).subscribe({
        next: (department) => {
          this.departmentForm.patchValue({
            name: department.name,
            description: department.description,
          });
        },
        error: (err) => {
          console.error('Error loading department details:', err);
          this.errorMessage = 'Failed to load department details.';
        },
      });
    }
  }

  // Mettre à jour le département
  updateDepartment(): void {
    if (this.departmentForm.valid) {
      const updatedData = this.departmentForm.value;
      this.departmentService.updateDepartment(this.departmentId, updatedData).subscribe({
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
          // Afficher une SweetAlert d'erreur en cas d'échec
          Swal.fire({
            icon: 'error',
            title: 'Erreur...',
            text: 'Échec de la mise à jour du département.',
          });
        },
      });
    }
  }

  // Annuler et retourner à la liste des départements
  cancel(): void {
    this.router.navigate(['/departments']);
  }
}