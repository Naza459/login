import { Component } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { HttpHeaders } from '@angular/common/http';

interface LoginResponse {
  status: number;
}

@Component({
  selector: 'app-login.component',
  templateUrl: './login.component.component.html',
  styleUrls: ['./login.component.component.css']
})
export class LoginComponentComponent {
  username: string;
  password: string;
  errorMessage: string;

  constructor(private http: HttpClient, private router: Router) {
    this.username = '';
    this.password = '';
    this.errorMessage = '';
  }

  forgotPassword() {
    // Obtener el nombre de usuario del localStorage
    const storedUsername = localStorage.getItem('username');
    if (storedUsername) {
      // Construir el cuerpo de la solicitud POST
      const body = { username: storedUsername };

      // Realizar la solicitud POST al endpoint de cambio de contraseña
      const endpoint = `http://localhost:8000/companies/change_password/`;

      this.http.post(endpoint, body).subscribe(
        (response) => {
          console.log('Solicitud de cambio de contraseña enviada:', response);
          // Realiza acciones adicionales si es necesario
        },
        (error) => {
          console.error('Error al enviar la solicitud de cambio de contraseña:', error);
          // Maneja el error de acuerdo a tus necesidades
        }
      );
    }
  }

    login() {
      console.log(this.username);
      console.log(this.password);

      // Realizar la solicitud HTTP POST al servicio de login
      this.http.post<LoginResponse>('http://localhost:8000/companies/login/', {
        username: this.username,
        password: this.password
      }).subscribe(response => {
        console.log('Login response', response);
        if (response.status === 200) {
          console.log('Login successful');
          
          // Realizar redireccionamiento al componente "Gerente"
          this.router.navigate(['/Gerente']);
        } else {
          console.log('Login error');
          if (response.status === 400) {
            this.errorMessage = 'El usuario no existe'; // Mensaje de error específico para el caso de usuario no encontrado
          } else {
            this.errorMessage = 'Credenciales inválidas'; // Mensaje de error genérico para otros errores
          }
        }
      }, (error: HttpErrorResponse) => {
        console.error('Login error', error);
        if (error.status === 400) {
          this.errorMessage = 'El usuario no existe'; // Mensaje de error específico para el caso de usuario no encontrado
        } else {
          this.errorMessage = 'Credenciales inválidas'; // Mensaje de error genérico para otros errores
        }
      });
    }
  }