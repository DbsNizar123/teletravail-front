import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule} from '@angular/forms';
import { HttpClientModule, provideHttpClient } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { AddUserComponent } from './add-user/add-user.component';
import { AdminComponent } from './dashboard/admin/admin.component';
import { ManagerComponent } from './dashboard/manager/manager.component';
import { EmployeComponent } from './dashboard/employe/employe.component';
import { UserListComponent } from './user-list/user-list.component';


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    AddUserComponent,
    
    AdminComponent,
    ManagerComponent,
    EmployeComponent,
    UserListComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    
    HttpClientModule
  ],
  providers: [provideHttpClient()],
  bootstrap: [AppComponent]
})
export class AppModule { }