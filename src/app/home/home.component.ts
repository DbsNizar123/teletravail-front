import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {

   isNavOpen = false;
   
  toggleNavbar() {
    this.isNavOpen = !this.isNavOpen;
  }

  onSubmit() {

  }

}
