import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { SqliteService } from '../../services/sqlite.service';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.page.html',
  styleUrls: ['./sign-up.page.scss'],
})
export class SignUpPage {
  email: string = '';
  password: string = '';
  nombre: string = '';
  apellido: string = '';
  nivelEducacion: string = '';
  fechaNacimiento: string = '';
  selectedDate: Date | null = null;

  constructor(
    private sqliteService: SqliteService,
    private alertController: AlertController,
    private router: Router
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
    return this.isValidEmail(this.email) && 
           this.isValidPassword(this.password) &&
           this.nombre.trim() !== '' &&
           this.apellido.trim() !== '' &&
           this.nivelEducacion.trim() !== '' &&
           this.selectedDate !== null;
  }

  async register() {
    try {
      await this.sqliteService.registerUser(this.email, this.password);
      const alert = await this.alertController.create({
        header: 'Éxito',
        message: 'Usuario registrado exitosamente',
        buttons: ['OK'],
      });
      await alert.present();
      this.router.navigate(['/login']);
    } catch (error) {
      const alert = await this.alertController.create({
        header: 'Error',
        message: 'Error al registrar el usuario',
        buttons: ['OK'],
      });
      await alert.present();
    }
  }
}
