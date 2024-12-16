import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { trigger, style, animate, transition, query, stagger } from '@angular/animations';
import { SqliteService } from '../../services/sqlite.service';
import { InfoLibroService } from '../../services/info-libro.service';
import { register } from 'swiper/element/bundle';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { MenuController } from '@ionic/angular';
import { AuthService } from '../../services/auth.service'; 
import { Router } from '@angular/router';
import { Camera, CameraResultType } from '@capacitor/camera';
import { Geolocation } from '@capacitor/geolocation';

register();

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
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
export class HomePage implements OnInit, AfterViewInit {
  @ViewChild('swiper') swiper!: ElementRef;

  swiperConfig = {
    slidesPerView: 1,
    spaceBetween: 10,
    pagination: {
      clickable: true,
      dynamicBullets: true,
      dynamicMainBullets: 4
    },
    navigation: true,
    loop: true,
    loopedSlides: 4,
    loopAdditionalSlides: 2,
    loopFillGroupWithBlank: true,
    autoplay: {
      delay: 3000,
      disableOnInteraction: false
    },
    breakpoints: {
      320: {
        slidesPerView: 1,
        spaceBetween: 10,
        slidesPerGroup: 1
      },
      480: {
        slidesPerView: 2,
        spaceBetween: 20,
        slidesPerGroup: 2
      },
      768: {
        slidesPerView: 3,
        spaceBetween: 30,
        slidesPerGroup: 3
      }
    }
  };

  async ngAfterViewInit() {
    if (this.swiper) {
      const swiperEl = this.swiper.nativeElement;
      Object.assign(swiperEl, this.swiperConfig);
      await swiperEl.initialize();
    }
  }

  ionViewWillEnter() {
    this.loadFilteredBooks();
  }

  swiperSlideChanged(e: any) {
    console.log('slide changed', e);
  }

  public titulo: string = '';
  public autor: string = '';
  public idioma: string = 'es';
  public libros: any[] = [];
  public selectedBook: any;
  public hasSearched: boolean = false;
  public isSearching: boolean = false;
  public autores: string[] = ['Haruki Murakami', 'Mieko Kawakami', 'Shuzaku Endo'];

  recentBooks = [
    { title: 'Cuando Silbo', author: 'Shuzaku Endo', coverImage: 'assets/covers/book1.jpg' },
    { title: 'El problema de los tres cuerpos', author: 'Cixin Liu', coverImage: 'assets/covers/book2.jpg' },
  ];

  recommendedBooks = [
    { title: 'Kafka en la orilla', author: 'Haruki Murakami', coverImage: 'assets/covers/book3.jpg' },
    { title: 'Microsiervos', author: 'Douglas Coupland', coverImage: 'assets/covers/book4.jpg' },
  ];

  public isLoading: boolean = false;

  private searchSubject = new Subject<string>();

  constructor(
    private sqlite: SqliteService,
    private infoLibroService: InfoLibroService,
    private menuCtrl: MenuController,
    private authService: AuthService,
    private router: Router,
  ) {}

  async toggleMenu() {
    await this.menuCtrl.toggle('mainMenu');
  }

  async logout() {
    this.authService.logout();
    await this.menuCtrl.close('mainMenu');
    this.router.navigate(['/login'], { replaceUrl: true });
  }

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
    if (!titulo || titulo.trim() === '') {
      this.libros = [];
      this.hasSearched = false;
      return;
    }

    this.hasSearched = true;
    this.isLoading = true;
    this.infoLibroService.getLibros(titulo)
      .then(response => {
        this.libros = response;
      })
      .catch(error => {
        console.error('Error al obtener libros:', error);
        this.libros = [];
      })
      .finally(() => {
        this.isLoading = false;
      });
  }

  getLibros() {
    this.infoLibroService.getLibros(this.titulo).then(response => {
      this.libros = response;
    }).catch(error => {
      console.error('Error al obtener libros:', error);
    });
  }

  async loadFilteredBooks() {
    this.isLoading = true;
    
    const promises = this.autores.map(autor =>
      this.infoLibroService.getLibros('', autor, this.idioma)
        .catch(error => {
          console.error(`Error loading books for ${autor}:`, error);
          return [];
        })
    );

    try {
      const results = await Promise.all(promises);
      const allBooks = results.reduce((acc, val) => acc.concat(val), []);
      const shuffledBooks = allBooks.sort(() => Math.random() - 0.5);
      this.recentBooks = shuffledBooks.slice(0, 4);
      this.recommendedBooks = shuffledBooks.slice(4, 8);
    } catch (error) {
      console.error('Error loading filtered books:', error);
      this.recentBooks = [];
      this.recommendedBooks = [];
    } finally {
      this.isLoading = false;
    }
  }

  selectBook(book: any) {
    if (this.selectedBook?.title === book.title) {
      this.selectedBook = null;
    } else {
      this.selectedBook = book;
    }
  }

  async addToMisList() {
    if (this.selectedBook) {
      try {
        const userId = await this.sqlite.getCurrentUserId();
        if (!userId) {
          throw new Error('No user logged in');
        }
  
        let userLists = await this.sqlite.getListasUsuario(userId);
        let listaId: number;
  
        if (!userLists || userLists.length === 0) {
          const result = await this.sqlite.createLista(userId, 'Mi Lista');
          listaId = result.changes?.lastId ?? 0;
        } else {
          listaId = userLists[0].id;
        }
  
        await this.sqlite.addBookToLista(listaId, {
          title: this.selectedBook.title,
          author: this.selectedBook.author,
          coverImage: this.selectedBook.coverImage
        });
  
        console.log('Libro agregado a Mis Listas:', this.selectedBook);
        this.selectedBook = null;
      } catch (error) {
        console.error('Error al agregar el libro a Mis Listas:', error);
      }
    }
  }

  handleImageError(event: any) {
    event.target.src = 'assets/covers/default.jpg';
  }

  async openCamera() {
    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: false,
      resultType: CameraResultType.Uri
    });

    console.log('Image URI:', image.webPath);
  }

  async getCurrentLocation() {
    const coordinates = await Geolocation.getCurrentPosition();
    console.log('Current position:', coordinates);
  }

  closeSearch() {
    this.hasSearched = false;
    this.libros = [];
    this.titulo = '';
  }
}