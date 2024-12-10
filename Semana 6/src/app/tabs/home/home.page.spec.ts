import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { HomePage } from './home.page';
import { InfoLibroService } from '../../services/info-libro.service';

describe('HomePage', () => {
    let component: HomePage;
    let infoLibroService: InfoLibroService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [
                HomePage,
                { provide: InfoLibroService, useValue: jasmine.createSpyObj('InfoLibroService', ['getLibros']) }
            ]
        });

        component = TestBed.inject(HomePage);
        infoLibroService = TestBed.inject(InfoLibroService);
    });

    it('Se filtran los libros correctamente', async () => {
        const mockBooks = [
            { title: 'Book 1', author: 'Author 1', coverImage: 'image1.jpg' },
            { title: 'Book 2', author: 'Author 2', coverImage: 'image2.jpg' },
            { title: 'Book 3', author: 'Author 3', coverImage: 'image3.jpg' },
            { title: 'Book 4', author: 'Author 4', coverImage: 'image4.jpg' },
            { title: 'Book 5', author: 'Author 5', coverImage: 'image5.jpg' },
            { title: 'Book 6', author: 'Author 6', coverImage: 'image6.jpg' },
            { title: 'Book 7', author: 'Author 7', coverImage: 'image7.jpg' },
            { title: 'Book 8', author: 'Author 8', coverImage: 'image8.jpg' }
        ];

        (infoLibroService.getLibros as jasmine.Spy).and.returnValue(Promise.resolve(mockBooks));

        await component.loadFilteredBooks();

        expect(component.isLoading).toBeFalse();
        expect(component.recentBooks.length).toBe(4);
        expect(component.recommendedBooks.length).toBe(4);
    });

    it('Se gestionan los errores al cargar los libros', async () => {
        (infoLibroService.getLibros as jasmine.Spy).and.returnValue(Promise.reject('Error loading books'));

        await component.loadFilteredBooks();

        expect(component.isLoading).toBeFalse();
        expect(component.recentBooks.length).toBe(0);
        expect(component.recommendedBooks.length).toBe(0);
    });

    it('Se gestiona el caso en que no hayan resultados al filtrar los libros', async () => {
        (infoLibroService.getLibros as jasmine.Spy).and.returnValue(Promise.resolve([]));

        await component.loadFilteredBooks();

        expect(component.isLoading).toBeFalse();
        expect(component.recentBooks.length).toBe(0);
        expect(component.recommendedBooks.length).toBe(0);
    });
});