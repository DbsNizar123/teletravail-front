import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { AddUserComponent } from './add-user/add-user.component';
import { AdminComponent } from './dashboard/admin/admin.component';
import { ManagerComponent } from './dashboard/manager/manager.component';
import { EmployeComponent } from './dashboard/employe/employe.component';
import { UserListComponent } from './user-list/user-list.component';
import { ProfileComponent } from './profile/profile.component';

const routes: Routes = [
  { path: 'admin', component: AdminComponent, children: [
      { path: 'add-user', component: AddUserComponent },
      { path: 'user-list', component: UserListComponent },
      { path: 'profile', component: ProfileComponent }, // Add profile route
  ]},
  
  { path: 'manager', component: ManagerComponent, children: [
      { path: 'profile', component: ProfileComponent }, // Add profile route
  ]},

  { path: 'employee', component: EmployeComponent, children: [
      { path: 'profile', component: ProfileComponent }, // Add profile route
  ]},

  { path: 'login', component: LoginComponent },
  { path: '', redirectTo: '/login', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }