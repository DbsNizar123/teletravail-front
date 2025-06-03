import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import Swal from 'sweetalert2';
import { DepartmentService } from '../services/department.service';

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.css']
})
export class AddUserComponent implements OnInit {
  userData = { 
    name: '', 
    email: '', 
    password: '', 
    role: '',
    department_id: undefined as number | undefined
  };
  
  departments: any[] = [];
  successMessage: string = '';
  errorMessage: string = '';

  constructor(
    private authService: AuthService,
    private departmentService: DepartmentService
  ) {}

  ngOnInit(): void {
    this.loadDepartments();
  }
  
  loadDepartments(): void {
    this.departmentService.getAllDepartments().subscribe({
      next: (departments) => {
        this.departments = departments;
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
  
  addUser() {

    if (!this.userData.name || !this.userData.email || !this.userData.password || !this.userData.role) {
      Swal.fire('Erreur !', 'Veuillez remplir tous les champs obligatoires', 'error');
      return;
    }

    if (this.userData.role !== 'admin' && (!this.userData.department_id || this.userData.department_id <= 0)) {
      Swal.fire('Erreur !', 'Veuillez sélectionner un département valide', 'error');
      return;
    }

    const userToCreate: any = {
      name: this.userData.name,
      email: this.userData.email,
      password: this.userData.password,
      role: this.userData.role
    };
    
    if (this.userData.role !== 'admin') {
      userToCreate.department_id = this.userData.department_id;
    }
  
    this.authService.addUser(userToCreate).subscribe(
      (response) => {
        Swal.fire({
          title: 'Succès !',
          text: 'Utilisateur ajouté avec succès !',
          icon: 'success',
          confirmButtonText: 'OK'
        });
        this.resetForm();
      },
      (error) => {
        Swal.fire({
          title: 'Erreur !',
          text: error.error?.message || 'Échec de l\'ajout de l\'utilisateur. Veuillez réessayer.',
          icon: 'error',
          confirmButtonText: 'OK'
        });
      }
    );
  }

  private resetForm(): void {
    this.userData = { 
      name: '', 
      email: '', 
      password: '', 
      role: '',
      department_id: undefined
    };
  }
}