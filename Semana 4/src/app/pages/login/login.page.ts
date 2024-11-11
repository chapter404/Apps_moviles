import { Component } from '@angular/core';
import { trigger, style, animate, transition } from '@angular/animations';
import { Router, NavigationExtras } from '@angular/router';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  animations: [
    trigger('fadeInUp', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(20px)' }),
        animate('600ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ])
  ]
})
export class LoginPage {
  email: string = '';
  password: string = '';

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
    return this.isValidEmail(this.email) && this.isValidPassword(this.password);
  }

  async login() {
    if (this.isFormValid()) {
      const navigationExtras: NavigationExtras = {
        queryParams: {
          email: this.email,
          password: this.password 
        }
      };
      this.router.navigate(['/tabs'], navigationExtras);
    } else {
      const alert = await this.alertController.create({
        header: 'Error',
        message: 'Los datos ingresados no son válidos',
        buttons: ['OK']
      });
      await alert.present();
    }
  }

  redirectToSignUp() {
    this.router.navigate(['/sign-up']);
  }
}
