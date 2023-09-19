import { Component } from '@angular/core';

@Component({
  selector: 'app-login.component',
  templateUrl: './login.component.component.html',
  styleUrls: ['./login.component.component.css']
})
export class LoginComponentComponent {
  email: string;
  password: string;
  
  constructor() {
    this.email = '';
    this.password = '';
  }
  login() {
    console.log(this.email);
    console.log(this.password);
  }
}
