import { Component, OnInit } from '@angular/core';
import { DepartmentService } from '../services/department.service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

@Component({
  selector: 'app-show-department',
  templateUrl: './show-department.component.html',
  styleUrls: ['./show-department.component.css'],
})
export class ShowDepartmentComponent implements OnInit {
  departments: any[] = []; // Array to store the list of departments

  constructor(
    private departmentService: DepartmentService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadDepartments(); // Load departments when the component initializes
  }

  // Load all departments from the backend
  loadDepartments() {
    this.departmentService.getDepartments().subscribe({
      next: (response) => {
        this.departments = response.departments; // Ensure the response has this structure
      },
      error: (error) => {
        Swal.fire({
          icon: 'error',
          title: 'Error...',
          text: 'Failed to load departments.',
        });
        console.error(error);
      },
    });
  }

  // Navigate to the edit department page
  editDepartment(departmentId: string) {
    this.router.navigate([`/edit-department/${departmentId}`]);
  }

  // Delete a department
  deleteDepartment(departmentId: string) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You will not be able to recover this department!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, keep it',
    }).then((result) => {
      if (result.isConfirmed) {
        this.departmentService.deleteDepartment(departmentId).subscribe({
          next: () => {
            Swal.fire({
              icon: 'success',
              title: 'Deleted!',
              text: 'Department has been deleted.',
            });
            this.loadDepartments(); // Refresh the list after deletion
          },
          error: (error) => {
            Swal.fire({
              icon: 'error',
              title: 'Error...',
              text: 'Failed to delete department.',
            });
            console.error(error);
          },
        });
      }
    });
  }
}