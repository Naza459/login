import { Component } from '@angular/core';
import { Location } from '@angular/common';

@Component({
  selector: 'app-password.component',
  templateUrl: './password.component.component.html',
  styleUrls: ['./password.component.component.css']
})
export class PasswordComponentComponent {
  newPassword: string;
  confirmpassword: string;
  showNewPassword: boolean;
  showConfirmPassword: boolean;
  
  constructor(private location: Location) {
    this.newPassword = '';
    this.confirmpassword = '';
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
    var button = document.getElementById(buttonId);
    if (button) {
      button.style.backgroundColor = color;
    }
  }
  login() {
    console.log(this.newPassword);
    console.log(this.confirmpassword);
  }
}