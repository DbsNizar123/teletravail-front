import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule} from '@angular/forms';
import { HttpClientModule, provideHttpClient } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { AddUserComponent } from './add-user/add-user.component';
import { AdminComponent } from './dashboard/admin/admin.component';
import { ManagerComponent } from './dashboard/manager/manager.component';
import { EmployeComponent } from './dashboard/employe/employe.component';
import { UserListComponent } from './user-list/user-list.component';
import { ProfileComponent } from './profile/profile.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { ReactiveFormsModule } from '@angular/forms';
import { UpdateUserComponent } from './update-user/update-user.component';
import { SubmitTeletravailRequestComponent } from './submit-teletravail-request/submit-teletravail-request.component';
import { ShowRequestComponent } from './show-request/show-request.component';
import { UpdateRequestComponent } from './update-request/update-request.component';
import { AddDepartmentComponent } from './add-department/add-department.component';
import { ShowDepartmentComponent } from './show-department/show-department.component';
import { DepartmentUpdateComponent } from './department-update/department-update.component';
import { ShowRequestsComponent } from './show-requests/show-requests.component';
import { CommonModule } from '@angular/common';
import { FullCalendarModule } from '@fullcalendar/angular';
import { GlobalSettingsCalendarComponent } from './global-settings-calendar/global-settings-calendar.component';
import { CalendarComponent } from './calendar/calendar.component';
import { TeletravailCalendarComponent } from './teletravail-calendar/teletravail-calendar.component';
import { StatisticsComponent } from './statistics/statistics.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';







@NgModule({
  declarations: [
    
    AppComponent,
    LoginComponent,
    AddUserComponent,
    
    AdminComponent,
    ManagerComponent,
    EmployeComponent,
    UserListComponent,
    ProfileComponent,
    ForgotPasswordComponent,
    ResetPasswordComponent,
    UpdateUserComponent,
    SubmitTeletravailRequestComponent,
    ShowRequestComponent,
    UpdateRequestComponent,
    AddDepartmentComponent,
    ShowDepartmentComponent,
    DepartmentUpdateComponent,
    ShowRequestsComponent,
    GlobalSettingsCalendarComponent,
    CalendarComponent,
    TeletravailCalendarComponent,
    StatisticsComponent,

   

    


   

    
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    BrowserModule,
    AppRoutingModule,
    RouterModule,
    FormsModule,
    HttpClientModule,
    FullCalendarModule,
    BrowserAnimationsModule
  ],
  providers: [provideHttpClient()],
  bootstrap: [AppComponent]
})
export class AppModule { }