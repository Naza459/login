import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { LoginComponentComponent } from './login/login.component/login.component.component';
import { PasswordComponentComponent } from './password/password.component/password.component.component';

const routes: Routes = [
  { path: "", component: LoginComponentComponent, pathMatch: "full" },
  { path: "login", component: LoginComponentComponent, pathMatch: "full" },
  { path: "Password", component: PasswordComponentComponent, pathMatch: "full" },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
