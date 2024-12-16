import { Component } from '@angular/core';
import { Geolocation } from '@capacitor/geolocation';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-recomendaciones',
  templateUrl: './recomendaciones.page.html',
  styleUrls: ['./recomendaciones.page.scss'],
})
export class RecomendacionesPage {
  public titulo: string = '';
  recommendedBooks = [
    {
      title: 'Crónicas Marcianas',
      author: 'Ray Bradbury',
      coverImage: 'assets/covers/cronicas_marcianas.jpg',
      description: 'Un clásico de la ciencia ficción que narra la colonización de Marte por humanos.',
    },
    {
      title: 'El Bosque Oscuro',
      author: 'Liu Cixin',
      coverImage: 'assets/covers/el_bosque_oscuro.jpg',
      description: 'Segunda parte de la trilogía de los Tres Cuerpos, donde la humanidad enfrenta una nueva amenaza.',
    },
  ];

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  async getCurrentLocation() {
    const coordinates = await Geolocation.getCurrentPosition();
    console.log('Current position:', coordinates);
  }

  async logout() {
    this.authService.logout();
    this.router.navigate(['/login'], { replaceUrl: true });
  }

  onSearchInput() {
  }
}