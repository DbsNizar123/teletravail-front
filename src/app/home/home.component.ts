import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {

   isNavOpen = false;
  formData = { name: '', email: '', message: '' };

  toggleNavbar() {
    this.isNavOpen = !this.isNavOpen;
  }

  onSubmit() {
    console.log('Form submitted:', this.formData);
    // Add logic to handle form submission (e.g., send to backend)
    this.formData = { name: '', email: '', message: '' }; // Reset form
  }

}
