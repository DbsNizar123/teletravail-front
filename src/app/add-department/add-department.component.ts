import { Component } from '@angular/core';
import { DepartmentService } from '../services/department.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-add-department',
  templateUrl: './add-department.component.html',
  styleUrls: ['./add-department.component.css'],
})
export class AddDepartmentComponent {
  departmentData = { name: '', description: '' }; // Object to store form data

  constructor(private departmentService: DepartmentService) {}

  addDepartment() {
    this.departmentService.addDepartment(this.departmentData).subscribe(
      (response) => {
        // Show success alert with SweetAlert2
        Swal.fire({
          title: 'Success!',
          text: 'Department added successfully!',
          icon: 'success',
          confirmButtonText: 'OK',
        });

        // Reset the form
        this.departmentData = { name: '', description: '' };
      },
      (error) => {
        // Show error alert with SweetAlert2
        Swal.fire({
          title: 'Error!',
          text: 'Failed to add department. Please try again.',
          icon: 'error',
          confirmButtonText: 'OK',
        });
      }
    );
  }
}