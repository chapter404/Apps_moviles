import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';

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

  constructor(private router: Router, private alertController: AlertController) {}

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
    if (this.isFormValid()) {
      const alert = await this.alertController.create({
        header: 'Registro Exitoso',
        message: 'Te has registrado exitosamente.',
        buttons: ['OK']
      });
      await alert.present();

      this.router.navigate(['/login']);
    } else {
      const alert = await this.alertController.create({
        header: 'Error',
        message: 'Por favor, complete todos los campos correctamente.',
        buttons: ['OK']
      });
      await alert.present();
    }
  }
}
