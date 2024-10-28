import { Component } from '@angular/core';
import { Router, NavigationExtras } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage {
  usuario: string = '';
  password: string = '';

  constructor(private router: Router) {}

  ingresar() {
    const usuarioValido = /^[a-zA-Z0-9]{3,8}$/.test(this.usuario);
    const passwordValido = /^[0-9]{4}$/.test(this.password);

    if (usuarioValido && passwordValido) {
      const navigationExtras: NavigationExtras = {
        queryParams: {
          usuario: this.usuario,
          password: this.password 
        }
      };
      
      this.router.navigate(['/home'], navigationExtras);
    } else {
      alert("Los datos ingresados no son válidos");
    }
  }
}