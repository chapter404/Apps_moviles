import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-libros-por-leer',
  templateUrl: './libros-por-leer.page.html',
  styleUrls: ['./libros-por-leer.page.scss'],
})
export class LibrosPorLeerPage implements OnInit {
  toReadBooks = [
    { title: 'Microsiervos', author: 'Douglas Coupland', description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.Donec interdum eu ante non feugiat. In eu odio rutrum, pulvinar lacus eu, cursus sapien' },
    { title: 'EL problema de los tres cuerpos', author: 'Liu Cixin', description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.Donec interdum eu ante non feugiat. In eu odio rutrum, pulvinar lacus eu, cursus sapien' },
  ];

  constructor() {}

  ngOnInit() {}
}
