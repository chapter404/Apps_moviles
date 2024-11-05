import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  recentBooks = [
    { title: 'Libro 1', author: 'Autor 1', coverImage: 'assets/covers/book1.jpg' },
    { title: 'Libro 2', author: 'Autor 2', coverImage: 'assets/covers/book2.jpg' },
  ];

  recommendedBooks = [
    { title: 'Libro A', author: 'Autor A', coverImage: 'assets/covers/book3.jpg' },
    { title: 'Libro B', author: 'Autor B', coverImage: 'assets/covers/book4.jpg' },
  ];

  constructor() {}
}
