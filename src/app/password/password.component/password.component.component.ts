import { Component } from '@angular/core';
import { Location } from '@angular/common';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-password.component',
  templateUrl: './password.component.component.html',
  styleUrls: ['./password.component.component.css']
})
export class PasswordComponentComponent {
  newPassword: string;
  confirmPassword: string;
  showNewPassword: boolean;
  showConfirmPassword: boolean;

  constructor(private location: Location, private http: HttpClient) {
    this.newPassword = '';
    this.confirmPassword = '';
    this.showNewPassword = false;
    this.showConfirmPassword = false;
  }

  toggleShowNewPassword() {
    this.showNewPassword = !this.showNewPassword;
  }

  toggleShowConfirmPassword() {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  goBack() {
    this.location.back();
  }

  changeButtonColor(buttonId: string, color: string) {
    const button = document.getElementById(buttonId);
    if (button) {
      button.style.backgroundColor = color;
    }
  }

  changePassword() {
    if (this.newPassword !== this.confirmPassword) {
      console.log('Las contraseñas no coinciden');
      return;
    }

    const userId = "gabriel1407"; // Reemplaza con el ID del usuario correspondiente

    const endpoint = `http://localhost:8000/companies/change_password/?username=${userId}`;

    const payload = {
      password: this.newPassword
    };

    this.http.put(endpoint, payload)
      .subscribe(
        (response) => {
          console.log('Contraseña cambiada exitosamente:', response);
          // Realiza acciones adicionales después de cambiar la contraseña si es necesario
        },
        (error) => {
          console.error('Error al cambiar la contraseña:', error);
          // Maneja el error de acuerdo a tus necesidades
        }
      );
  }
}