import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-usuario',
  templateUrl: './usuario.component.html',
  styleUrls: ['./usuario.component.css']
})
export class UsuarioComponent implements OnInit {
  usuarios: any[] = [];
  nuevoUsuario: any = {};
  usuarioCreado: boolean = false;

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.getUsuarios();
  }

  getUsuarios(): void {
    this.http.get<any[]>('http://localhost:8000/users/users')
      .subscribe(
        response => {
          this.usuarios = response;
        },
        error => {
          console.log(error);
        }
      );
  }

  agregarUsuario(): void {
    const usuario = {
      username: this.nuevoUsuario.username,
      password: this.nuevoUsuario.password,
      first_name: this.nuevoUsuario.firstName,
      last_name: this.nuevoUsuario.lastName,
      email: this.nuevoUsuario.email,
      rol: this.nuevoUsuario.rol
    };

    this.http.post('http://localhost:8000/users/users', usuario)
      .subscribe(
        response => {
          console.log('Usuario agregado con éxito');
          this.usuarioCreado = true;
          this.getUsuarios();
        },
        error => {
          console.log(error);
        }
      );
  }

  actualizarUsuario(usuario: any): void {
    const url = `http://localhost:8000/users/users/${usuario.id}`;
    this.http.put(url, usuario)
      .subscribe(
        response => {
          console.log('Usuario actualizado con éxito');
          this.getUsuarios();
        },
        error => {
          console.log(error);
        }
      );
  }

  eliminarUsuario(id: number): void {
    const url = `http://localhost:8000/users/users/${id}`;
    this.http.delete(url)
      .subscribe(
        response => {
          console.log('Usuario eliminado con éxito');
          this.getUsuarios();
        },
        error => {
          console.log(error);
        }
      );
  }
}