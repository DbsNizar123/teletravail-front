import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { AddUserComponent } from './add-user/add-user.component';
import { AdminComponent } from './dashboard/admin/admin.component';
import { ManagerComponent } from './dashboard/manager/manager.component';
import { EmployeComponent } from './dashboard/employe/employe.component';
import { UserListComponent } from './user-list/user-list.component';
import { ProfileComponent } from './profile/profile.component';
import { ModifierUserComponent } from './modifier-user/modifier-user.component'; // Import the ModifierUserComponent
import { SupprimerUserComponent } from './supprimer-user/supprimer-user.component'; // Import the SupprimerUserComponent
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';


const routes: Routes = [
  { 
    path: 'admin', 
    component: AdminComponent, 
    children: [
      { path: 'add-user', component: AddUserComponent },
      { path: 'user-list', component: UserListComponent },
      { path: 'profile', component: ProfileComponent },
     
    ]
  },
 
  { path: 'modifier-user/:id', component: ModifierUserComponent }, // Add route for modifier-user
      { path: 'supprimer-user/:id', component: SupprimerUserComponent }, // Add route for supprimer-user
  { 
    path: 'manager', 
    component: ManagerComponent, 
    children: [
      { path: 'profile', component: ProfileComponent },
    ]
  },
  { path: 'forgot-password', component: ForgotPasswordComponent },
  { path: 'reset-password/:token', component: ResetPasswordComponent },
  { 
    path: 'employee', 
    component: EmployeComponent, 
    children: [
      { path: 'profile', component: ProfileComponent },
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