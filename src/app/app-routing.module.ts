import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { LoginComponentComponent } from './login/login.component/login.component.component';
import { PasswordComponentComponent } from './password/password.component/password.component.component';
import { GerentComponent } from './gerent/gerent.component';
import { UsuarioComponent } from './usuario/usuario.component';
const routes: Routes = [
  { path: "", component: LoginComponentComponent, pathMatch: "full" },
  { path: "login", component: LoginComponentComponent, pathMatch: "full" },
  { path: "Password", component: PasswordComponentComponent, pathMatch: "full" },
  {path: "Gerente", component: GerentComponent, pathMatch: "full" },
  {path: "Usuario", component: UsuarioComponent, pathMatch: "full" },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
