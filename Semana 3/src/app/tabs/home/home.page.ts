import { Component } from '@angular/core';
import { trigger, style, animate, transition, query, stagger } from '@angular/animations';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  animations: [
    trigger('staggeredFadeIn', [
      transition(':enter', [
        query('.book-card', [
          style({ opacity: 0, transform: 'translateY(10px)' }),
          stagger(100, [
            animate('400ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
          ])
        ])
      ])
    ])
  ]
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
