import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-libros-leidos',
  templateUrl: './libros-leidos.page.html',
  styleUrls: ['./libros-leidos.page.scss'],
})
export class LibrosLeidosPage implements OnInit {
  readBooks = [
    { title: 'Kafka en la orilla',
      author: 'Haruki Murakami',
      description:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit.Donec interdum eu ante non feugiat. In eu odio rutrum, pulvinar lacus eu, cursus sapien' },
    { title: 'Cuando silbo',
      author: 'Shusaku Endo',
      description:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit.Donec interdum eu ante non feugiat. In eu odio rutrum, pulvinar lacus eu, cursus sapien' },
  ];

  constructor() {}

  ngOnInit() {}
}
