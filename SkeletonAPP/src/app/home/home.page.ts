import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AnimationController } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  usuario!: string;
  nombre!: string;
  apellido!: string;
  nivelEducacion!: string;
  fechaNacimiento!: string;

  constructor(private route: ActivatedRoute, private animationCtrl: AnimationController) {
    this.route.queryParams.subscribe(params => {
      this.usuario = params['usuario'];
    });
  }

  limpiar() {
    this.animateInput('nombreInput');
    this.animateInput('apellidoInput');

    this.nombre = '';
    this.apellido = '';
    this.nivelEducacion = '';
    this.fechaNacimiento = '';
  }

  mostrar() {
    const mensaje = `Nombre: ${this.nombre}, Apellido: ${this.apellido}`;
    alert(mensaje);
  }

  private animateInput(inputId: string) {
    const inputElement = document.getElementById(inputId);
    if (inputElement) {
      const animation = this.animationCtrl.create()
        .addElement(inputElement)
        .duration(1000)
        .iterations(1)
        .keyframes([
          { offset: 0, transform: 'translateX(0)' },
          { offset: 0.5, transform: 'translateX(20px)' },
          { offset: 1, transform: 'translateX(0)' },
        ]);
      animation.play();
    }
  }
}