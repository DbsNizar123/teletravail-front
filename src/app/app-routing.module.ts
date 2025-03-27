import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { AddUserComponent } from './add-user/add-user.component';
import { AdminComponent } from './dashboard/admin/admin.component';
import { ManagerComponent } from './dashboard/manager/manager.component';
import { EmployeComponent } from './dashboard/employe/employe.component';
import { UserListComponent } from './user-list/user-list.component';
import { ProfileComponent } from './profile/profile.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { UpdateUserComponent } from './update-user/update-user.component';
import { SubmitTeletravailRequestComponent } from './submit-teletravail-request/submit-teletravail-request.component';
import { ShowRequestComponent } from './show-request/show-request.component';
import { UpdateRequestComponent } from './update-request/update-request.component';
import { AddDepartmentComponent } from './add-department/add-department.component';

import { ShowDepartmentComponent } from './show-department/show-department.component';
import { DepartmentUpdateComponent } from './department-update/department-update.component';



const routes: Routes = [
  { 
    path: 'admin', 
    component: AdminComponent, 
    children: [
      { path: 'add-user', component: AddUserComponent },
      { path: 'user-list', component: UserListComponent },
      { path: 'update-user/:id', component: UpdateUserComponent },
      { path: 'profile', component: ProfileComponent }, 
      { path: 'add-department', component: AddDepartmentComponent },
      { path: 'show-department', component: ShowDepartmentComponent },
      { path: 'delete-department/:id', component: ShowDepartmentComponent }, 
      
  
   
      { path: 'departments/update/:id', component: DepartmentUpdateComponent },
    ]
  },


  { 
    path: 'manager', 
    component: ManagerComponent, 
    children: [
      { path: 'profile', component: ProfileComponent },
      { path: 'ajouterdemande', component: SubmitTeletravailRequestComponent },
      { path: 'voirdemande', component: ShowRequestComponent },
      { path: 'modifierdemande/:id', component: UpdateRequestComponent },

      { path: 'show-department', component: ShowDepartmentComponent },
     
   
  
   

    ]
  },
  { path: 'forgot-password', component: ForgotPasswordComponent },
  { path: 'reset-password/:token', component: ResetPasswordComponent },
  { 
    path: 'employee', 
    component: EmployeComponent, 
    children: [
      { path: 'profile', component: ProfileComponent },
      { path: 'ajouterdemande', component: SubmitTeletravailRequestComponent },
      { path: 'voirdemande', component: ShowRequestComponent },
      { path: 'modifierdemande/:id', component: UpdateRequestComponent },
     
    ]
  },
  { path: 'login', component: LoginComponent },
  { path: '', redirectTo: '/login', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }