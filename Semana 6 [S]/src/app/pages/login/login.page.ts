import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { AuthService } from '../../services/auth.service';
import { SqliteService } from '../../services/sqlite.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage {
  email: string = '';
  password: string = '';
  errorMessage: string = '';

  constructor(
    private sqliteService: SqliteService,
    private router: Router,
    private alertController: AlertController,
    private authService: AuthService
  ) {}

  isValidEmail(email: string): boolean {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  }

  isValidPassword(password: string): boolean {
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,20}$/;
    return passwordRegex.test(password);
  }

  isFormValid(): boolean {
    return this.isValidEmail(this.email) && this.isValidPassword(this.password);
  }

  async login() {
    if (this.isFormValid()) {
      const loginSuccess = await this.authService.login(this.email, this.password);
      if (loginSuccess) {
        this.router.navigate(['/tabs'], { replaceUrl: true });
      } else {
        const alert = await this.alertController.create({
          header: 'Error',
          message: 'Correo o contraseña incorrectos.',
          buttons: ['OK'],
        });
        await alert.present();
      }
    }
  }


  redirectToSignUp() {
    this.router.navigate(['/sign-up']);
  }
}