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
  departments: any[] = [];
  currentPage: number = 1;
  totalPages: number = 0;
  limit: number = 10; // Number of departments per page

  constructor(
    private departmentService: DepartmentService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadDepartments();
  }

  loadDepartments() {
    this.departmentService.getDepartments(this.currentPage, this.limit).subscribe({
      next: (response) => {
        this.departments = response.data; // Adjust based on your API response
        this.totalPages = response.last_page; // Adjust based on your API response
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

  editDepartment(departmentId: string) {
    this.router.navigate([`/edit-department/${departmentId}`]);
  }

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

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.loadDepartments();
    }
  }

  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.loadDepartments();
    }
  }
}