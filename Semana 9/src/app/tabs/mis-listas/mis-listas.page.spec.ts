import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { MisListasPage } from './mis-listas.page';
import { SqliteService } from '../../services/sqlite.service';
import { of } from 'rxjs';

describe('MisListasPage', () => {
    let component: MisListasPage;
    let fixture: ComponentFixture<MisListasPage>;
    let sqliteServiceSpy: jasmine.SpyObj<SqliteService>;

    beforeEach(waitForAsync(() => {
        const spy = jasmine.createSpyObj('SqliteService', ['getCurrentUserId', 'getListasUsuario', 'getLibrosLista']);

        TestBed.configureTestingModule({
            declarations: [MisListasPage],
            imports: [IonicModule.forRoot()],
            providers: [
                { provide: SqliteService, useValue: spy }
            ]
        }).compileComponents();

        sqliteServiceSpy = TestBed.inject(SqliteService) as jasmine.SpyObj<SqliteService>;
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(MisListasPage);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('Se crea el componente', () => {
        expect(component).toBeTruthy();
    });

    it('Se inicializa el usuario', async () => {
        sqliteServiceSpy.getCurrentUserId.and.returnValue(Promise.resolve(1));
        await component.ngOnInit();
        expect(component.userId).toBe(1);
    });

    it('Se carga la lista del usuario al ingresar a la pagina', async () => {
        component.userId = 1;
      
        const listasMock = [{
            id: 1,
            name: 'Lista 1',
            cantidad_libros: 0
        }];
        
        const librosMock = [{
            id: 1,
            title: 'Libro 1'
        }];
      
        sqliteServiceSpy.getListasUsuario.and.returnValue(Promise.resolve(listasMock));
        sqliteServiceSpy.getLibrosLista.and.returnValue(Promise.resolve(librosMock));
      
        await component.ionViewWillEnter();
      
        expect(sqliteServiceSpy.getListasUsuario).toHaveBeenCalledWith(1);
        expect(sqliteServiceSpy.getLibrosLista).toHaveBeenCalledWith(1);
        expect(component.listas.length).toBe(1);
        expect(component.listas[0]).toEqual({
            id: 1,
            name: 'Lista 1',
            books: librosMock,
            cantidad_libros: 1
        });
      });

    it('Se gestionan los errores al cargar las listas', async () => {
        spyOn(console, 'error');
        component.userId = 1;
        sqliteServiceSpy.getListasUsuario.and.returnValue(Promise.reject('Error'));

        await component.loadListas();
        expect(console.error).toHaveBeenCalledWith('Error al cargar listas:', 'Error');
    });
});