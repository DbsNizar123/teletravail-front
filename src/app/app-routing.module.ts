// src/app/app-routing.module.ts
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
import { ShowRequestsComponent } from './show-requests/show-requests.component';
import { GlobalSettingsCalendarComponent } from './global-settings-calendar/global-settings-calendar.component';
import { CalendarComponent } from './calendar/calendar.component';
import { TeletravailCalendarComponent } from './teletravail-calendar/teletravail-calendar.component';
import { StatisticsComponent } from './statistics/statistics.component';
import { ChatbotComponent } from './chatbot/chatbot.component';// Create this component
import { AuthGuard } from './auth.guard';
import { UnauthorizedComponent } from './unauthorized/unauthorized.component';
import { HomeComponent } from './home/home.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'forgot-password', component: ForgotPasswordComponent },
  { path: 'reset-password/:token', component: ResetPasswordComponent },
  { path: 'unauthorized', component: UnauthorizedComponent }, // Add unauthorized route

  // Admin routes
  {
    path: 'admin',
    component: AdminComponent,
    canActivate: [AuthGuard],
    data: { roles: ['admin'] }, // Restrict to admin role
    children: [
      { path: 'add-user', component: AddUserComponent },
      { path: 'user-list', component: UserListComponent },
      { path: 'update-user/:id', component: UpdateUserComponent },
      { path: 'profile', component: ProfileComponent },
      { path: 'add-department', component: AddDepartmentComponent },
      { path: 'show-department', component: ShowDepartmentComponent },
      { path: 'delete-department/:id', component: ShowDepartmentComponent },
      { path: 'show-requests', component: ShowRequestsComponent },
      { path: 'departments/update/:id', component: DepartmentUpdateComponent },
      { path: 'teletravail-calendar', component: TeletravailCalendarComponent },
      { path: 'global-settings', component: GlobalSettingsCalendarComponent },
      { path: 'statistics', component: StatisticsComponent },
    ],
  },

  // Manager routes
  {
    path: 'manager',
    component: ManagerComponent,
    canActivate: [AuthGuard],
    data: { roles: ['manager'] }, // Restrict to manager role
    children: [
      { path: 'profile', component: ProfileComponent },
      { path: 'ajouterdemande', component: SubmitTeletravailRequestComponent },
      { path: 'voirdemande', component: ShowRequestComponent },
      { path: 'modifierdemande/:id', component: UpdateRequestComponent },
      { path: 'show-department', component: ShowDepartmentComponent },
      { path: 'show-requests', component: ShowRequestsComponent },
      { path: 'calendar', component: CalendarComponent },
      { path: 'teletravail-calendar', component: TeletravailCalendarComponent },
      { path: 'chatbot', component: ChatbotComponent },
    ],
  },

  // Employee routes
  {
    path: 'employee',
    component: EmployeComponent,
    canActivate: [AuthGuard],
    data: { roles: ['employee'] }, // Restrict to employee role
    children: [
      { path: 'profile', component: ProfileComponent },
      { path: 'ajouterdemande', component: SubmitTeletravailRequestComponent },
      { path: 'voirdemande', component: ShowRequestComponent },
      { path: 'modifierdemande/:id', component: UpdateRequestComponent },
      { path: 'calendar', component: CalendarComponent },
      { path: 'chatbot', component: ChatbotComponent },
    ],
  },

  // Redirect to login by default
  { path: '', component: HomeComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}