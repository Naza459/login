import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from "@angular/forms";
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { LoginComponentComponent } from './login/login.component/login.component.component';
import { PasswordComponentComponent } from './password/password.component/password.component.component';
import { GerentComponent } from './gerent/gerent.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponentComponent,
    PasswordComponentComponent,
    GerentComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
   HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
