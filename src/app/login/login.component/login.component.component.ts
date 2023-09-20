import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-login.component',
  templateUrl: './login.component.component.html',
  styleUrls: ['./login.component.component.css']
})
export class LoginComponentComponent {
  username: string;
  password: string;
  
  constructor(private http: HttpClient) {
    this.username = '';
    this.password = '';
  }
  
  login() {
    console.log(this.username);
    console.log(this.password);
    
    // Realizar la solicitud HTTP POST al servicio de login
    this.http.post('http://localhost:8000/companies/login/', {
      username: this.username,
      password: this.password
    }).subscribe(response => {
      console.log('Login successful', response);
      // Aquí puedes realizar acciones adicionales después de un inicio de sesión exitoso
    }, error => {
      console.error('Login error', error);
      // Aquí puedes manejar el error en caso de un inicio de sesión fallido
    });
  }
}