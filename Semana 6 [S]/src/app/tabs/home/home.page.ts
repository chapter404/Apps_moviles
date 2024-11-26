import { Component, OnInit } from '@angular/core';
import { trigger, style, animate, transition, query, stagger } from '@angular/animations';
import { SqliteService } from '../../services/sqlite.service';
import { InfoLibroService } from 'src/app/services/info-libro.service';
import { register } from 'swiper/element/bundle';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

register();

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
  public titulo: string = '';
  public autor: string = '';
  public idioma: string = 'es';
  public libros: any[] = [];
  public selectedBook: any;
  public autores: string[] = ['Haruki Murakami', 'Mieko Kawakami', 'Shuzaku Endo'];

  recentBooks: any[] = [];
  recommendedBooks: any[] = [];

  private searchSubject = new Subject<string>();

  constructor(
    private sqlite: SqliteService,
    private infoLibroService: InfoLibroService
  ) {}

  ngOnInit() {
    this.searchSubject.pipe(
      debounceTime(100),
      distinctUntilChanged()
    ).subscribe(titulo => {
      this.buscarLibros(titulo);
    });
  }

  onSearchInput() {
    this.searchSubject.next(this.titulo);
  }

  private buscarLibros(titulo: string) {
    if (titulo.trim() === '') {
      this.libros = [];
      return;
    }

    this.infoLibroService.getLibros(titulo).then(response => {
      this.libros = response;
    }).catch(error => {
      console.error('Error al obtener libros:', error);
    });
  }


  ionViewWillEnter() {
    this.loadFilteredBooks();
  }


  getLibros() {
    this.infoLibroService.getLibros(this.titulo).then(response => {
      this.libros = response;
    }).catch(error => {
      console.error('Error al obtener libros:', error);
    });
  }


  loadFilteredBooks() {
    const promises = this.autores.map(autor =>
      this.infoLibroService.getLibros('', autor, this.idioma)
    );

    Promise.all(promises).then(results => {
      const allBooks = results.reduce((acc, val) => acc.concat(val), []);
      this.recentBooks = allBooks.slice(0, 4);
      this.recommendedBooks = allBooks.slice(4, 8);
    }).catch(error => {
      console.error('Error al cargar libros filtrados:', error);
    });
  }


  async saveBook(book: { title: string; author: string; coverImage: string }) {
    try {
      await this.sqlite.addBook(book);
      console.log('Libro guardado:', book);
    } catch (error) {
      console.error('Error al guardar el libro:', error);
    }
  }


  selectBook(book: any) {
    this.selectedBook = book;
  }


  async addToMisList() {
    if (this.selectedBook) {
      try {
        await this.sqlite.addBookToMisList(this.selectedBook);
        console.log('Libro agregado a Mis Listas:', this.selectedBook);
        this.selectedBook = null;
      } catch (error) {
        console.error('Error al agregar el libro a Mis Listas:', error);
      }
    }
  }


  swiperSlideChanged(e: any) {
    console.log('Slide cambiado:', e);
  }
}
