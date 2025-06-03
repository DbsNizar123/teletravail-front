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
  submitted: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private departmentService: DepartmentService
  ) {}

  ngOnInit(): void {
    this.departmentId = this.route.snapshot.paramMap.get('id') || '';
    this.loadDepartmentDetails();
  }

  loadDepartmentDetails(): void {
    if (this.departmentId) {
      this.departmentService.getDepartmentById(this.departmentId).subscribe({
        next: (response) => {
          this.department = {
            name: response.department.name,
            description: response.department.description || '', 
          };
        },
        error: (err) => {
          console.error('Error loading department details:', err);
          this.errorMessage = 'Échec du chargement des détails du département.';
        },
      });
    }
  }

  onSubmit(): void {
    this.submitted = true;
    if (this.department.name) {
      this.departmentService.updateDepartment(this.departmentId, this.department).subscribe({
        next: () => {
          Swal.fire({
            icon: 'success',
            title: 'Succès !',
            text: 'Le département a été mis à jour avec succès.',
            confirmButtonText: 'OK',
          }).then((result) => {
            if (result.isConfirmed) {
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

  cancel(): void {
    this.router.navigate(['/departments']);
  }
}