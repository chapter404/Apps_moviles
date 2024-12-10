import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { SignUpPage } from './sign-up.page';
import { SqliteService } from '../../services/sqlite.service';
import { of, throwError } from 'rxjs';

describe('SignUpPage', () => {
    let component: SignUpPage;
    let fixture: ComponentFixture<SignUpPage>;
    let sqliteServiceSpy: jasmine.SpyObj<SqliteService>;
    let alertControllerSpy: jasmine.SpyObj<AlertController>;
    let routerSpy: jasmine.SpyObj<Router>;

    beforeEach(async () => {
        const sqliteSpy = jasmine.createSpyObj('SqliteService', ['registerUser']);
        const alertSpy = jasmine.createSpyObj('AlertController', ['create']);
        const routerSpyObj = jasmine.createSpyObj('Router', ['navigate']);

        await TestBed.configureTestingModule({
            declarations: [SignUpPage],
            providers: [
                { provide: SqliteService, useValue: sqliteSpy },
                { provide: AlertController, useValue: alertSpy },
                { provide: Router, useValue: routerSpyObj },
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(SignUpPage);
        component = fixture.componentInstance;
        sqliteServiceSpy = TestBed.inject(SqliteService) as jasmine.SpyObj<SqliteService>;
        alertControllerSpy = TestBed.inject(AlertController) as jasmine.SpyObj<AlertController>;
        routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    });

    it('Se crea el componente', () => {
        expect(component).toBeTruthy();
    });

    it('Se valida el email', () => {
        expect(component.isValidEmail('test@example.com')).toBeTrue();
        expect(component.isValidEmail('invalid-email')).toBeFalse();
    });

    it('Se valida la contraseña', () => {
        expect(component.isValidPassword('Password1')).toBeTrue();
        expect(component.isValidPassword('short')).toBeFalse();
    });

    it('Se valida el formulario', () => {
        component.email = 'test@example.com';
        component.password = 'Password1';
        component.nombre = 'John';
        component.apellido = 'Doe';
        component.nivelEducacion = 'Bachelor';
        component.selectedDate = new Date();

        expect(component.isFormValid()).toBeTrue();

        component.email = 'invalid-email';
        expect(component.isFormValid()).toBeFalse();
    });

    it('Se registra a un usuario', async () => {
        sqliteServiceSpy.registerUser.and.returnValue(Promise.resolve({ changes: { changes: 1 } }));
        const alertSpy = jasmine.createSpyObj('HTMLIonAlertElement', ['present']);
        alertControllerSpy.create.and.returnValue(Promise.resolve(alertSpy));

        await component.register();

        expect(sqliteServiceSpy.registerUser).toHaveBeenCalledWith(component.email, component.password);
        expect(alertControllerSpy.create).toHaveBeenCalledWith({
            header: 'Éxito',
            message: 'Usuario registrado exitosamente',
            buttons: ['OK'],
        });
        expect(alertSpy.present).toHaveBeenCalled();
        expect(routerSpy.navigate).toHaveBeenCalledWith(['/login']);
    });

    it('Se muestra una alerta de error', async () => {
        sqliteServiceSpy.registerUser.and.returnValue(Promise.reject('Error'));
        const alertSpy = jasmine.createSpyObj('HTMLIonAlertElement', ['present']);
        alertControllerSpy.create.and.returnValue(Promise.resolve(alertSpy));

        await component.register();

        expect(sqliteServiceSpy.registerUser).toHaveBeenCalledWith(component.email, component.password);
        expect(alertControllerSpy.create).toHaveBeenCalledWith({
            header: 'Error',
            message: 'Error al registrar el usuario',
            buttons: ['OK'],
        });
        expect(alertSpy.present).toHaveBeenCalled();
    });
});