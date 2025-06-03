import { Component, OnInit } from '@angular/core';
import { DepartmentService } from '../services/department.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-add-department',
  templateUrl: './add-department.component.html',
  styleUrls: ['./add-department.component.css']
})
export class AddDepartmentComponent implements OnInit {
  departmentData = {
    name: '',
    description: ''
  };

  constructor(private departmentService: DepartmentService) {}

  ngOnInit(): void {}

  addDepartment(): void {
    if (!this.departmentData.name.trim()) {
      Swal.fire('Erreur !', 'Veuillez entrer un nom de département', 'error');
      return;
    }

    this.departmentService.addDepartment(this.departmentData).subscribe({
      next: (response) => {
        Swal.fire({
          title: 'Succès !',
          text: 'Département ajouté avec succès !',
          icon: 'success',
          confirmButtonText: 'OK'
        });
        this.resetForm();
      },
      error: (error) => {
        Swal.fire({
          title: 'Erreur !',
          text: error.error?.message || 'Échec de l\'ajout du département. Veuillez réessayer.',
          icon: 'error',
          confirmButtonText: 'OK'
        });
      }
    });
  }

  private resetForm(): void {
    this.departmentData = {
      name: '',
      description: ''
    };
  }
}