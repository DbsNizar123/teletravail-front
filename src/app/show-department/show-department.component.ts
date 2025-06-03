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
  filteredDepartments: any[] = [];
  cachedDepartments: any[] = [];
  currentPage: number = 1;
  totalPages: number = 0;
  limit: number = 10;
  searchTerm: string = '';
  visitedPages: Set<number> = new Set();

  constructor(
    private departmentService: DepartmentService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadDepartments();
  }

  loadDepartments(): void {
    if (this.visitedPages.has(this.currentPage)) {

      this.departments = this.cachedDepartments.filter(d => 
        Math.floor((this.cachedDepartments.indexOf(d) / this.limit) + 1) === this.currentPage
      );
      this.filterDepartments();
      return;
    }

    this.departmentService.getDepartments(this.currentPage, this.limit).subscribe({
      next: (response) => {
        this.departments = response.data;
        this.totalPages = response.last_page;
        this.visitedPages.add(this.currentPage);

        response.data.forEach((newDept: any) => {
          if (!this.cachedDepartments.some(d => d.id === newDept.id)) {
            this.cachedDepartments.push(newDept);
          }
        });

        this.filterDepartments();
      },
      error: (error) => {
        Swal.fire({
          icon: 'error',
          title: 'Erreur...',
          text: 'Échec du chargement des départements.',
        });
        console.error(error);
      },
    });
  }

  filterDepartments(): void {
    if (!this.searchTerm) {
      this.filteredDepartments = [...this.departments];
    } else {
      this.filteredDepartments = this.cachedDepartments.filter(department =>
        department.name.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    }
  }

  editDepartment(id: string): void {
    console.log('Editing department with ID:', id);
    this.router.navigate(['/admin/departments/update', id]);
  }

  deleteDepartment(departmentId: string): void {
    Swal.fire({
      title: 'Êtes-vous sûr?',
      text: 'Vous ne pourrez pas récupérer ce département!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Oui, supprimer!',
      cancelButtonText: 'Non, conserver',
    }).then((result) => {
      if (result.isConfirmed) {
        this.departmentService.deleteDepartment(departmentId).subscribe({
          next: () => {
            Swal.fire({
              icon: 'success',
              title: 'Supprimé!',
              text: 'Le département a été supprimé.',
            });
            this.cachedDepartments = this.cachedDepartments.filter(d => d.id !== departmentId);
            this.departments = this.departments.filter(d => d.id !== departmentId);
            this.filterDepartments();
          },
          error: (error) => {
            Swal.fire({
              icon: 'error',
              title: 'Erreur...',
              text: 'Échec de la suppression du département.',
            });
            console.error(error);
          },
        });
      }
    });
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.loadDepartments();
    }
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.loadDepartments();
    }
  }
}