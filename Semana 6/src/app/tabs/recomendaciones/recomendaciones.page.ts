import { Component } from '@angular/core';

@Component({
  selector: 'app-recomendaciones',
  templateUrl: './recomendaciones.page.html',
  styleUrls: ['./recomendaciones.page.scss'],
})
export class RecomendacionesPage {
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

  constructor() {}
}
