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
import { ChatbotComponent } from './chatbot/chatbot.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'forgot-password', component: ForgotPasswordComponent },
  { path: 'reset-password/:token', component: ResetPasswordComponent },

  // Admin routes (protected by AuthGuard and role: admin)
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
      { path: 'show-requests', component: ShowRequestsComponent },
      { path: 'departments/update/:id', component: DepartmentUpdateComponent },
      { path: 'teletravail-calendar', component: TeletravailCalendarComponent },
      { path: 'global-settings', component: GlobalSettingsCalendarComponent },
      { path: 'statistics', component: StatisticsComponent },
    ],
  },

  // Manager routes (protected by AuthGuard and role: manager)
  {
    path: 'manager',
    component: ManagerComponent,
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

  // Employee routes (protected by AuthGuard and role: employee)
  {
    path: 'employee',
    component: EmployeComponent,
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
  { path: '', redirectTo: '/login', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}