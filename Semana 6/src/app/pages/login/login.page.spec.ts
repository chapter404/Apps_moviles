import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { AlertController, IonicModule } from '@ionic/angular';
import { LoginPage } from './login.page';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { AuthService } from '../../services/auth.service';

describe('LoginPage', () => {
  let component: LoginPage;
  let fixture: ComponentFixture<LoginPage>;
  let routerSpy = jasmine.createSpyObj('Router', ['navigate']);
  let alertControllerSpy = jasmine.createSpyObj('AlertController', ['create']);
  let authServiceSpy = jasmine.createSpyObj('AuthService', ['login']);

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IonicModule.forRoot(), NoopAnimationsModule],
      declarations: [LoginPage],
      providers: [
        { provide: Router, useValue: routerSpy },
        { provide: AlertController, useValue: alertControllerSpy },
        { provide: AuthService, useValue: authServiceSpy },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('Se crea el componente', () => {
    expect(component).toBeTruthy();
  });

  it('Se valida el correo', () => {
    expect(component.isValidEmail('prueba@prueba.cl')).toBeTrue();
    expect(component.isValidEmail('email-no-valido')).toBeFalse();
  });

  it('Se valida la contraseña', () => {
    expect(component.isValidPassword('prueba12345')).toBeTrue();
    expect(component.isValidPassword('prueba')).toBeFalse();
  });

  it('Se valida el formulario', () => {
    component.email = 'prueba@prueba.cl';
    component.password = 'prueba12345';
    expect(component.isFormValid()).toBeTrue();

    component.email = 'email-no-valido';
    component.password = 'prueba12345';
    expect(component.isFormValid()).toBeFalse();
  });

  it('Se redirecciona a la pagina principal despues de ingresar con las credenciales', async () => {
    component.email = 'prueba@prueba.cl';
    component.password = 'prueba12345';

    authServiceSpy.login.and.returnValue(Promise.resolve(true));

    await component.login();

    expect(routerSpy.navigate).toHaveBeenCalledWith(['/tabs'], { replaceUrl: true });
  });

  it('Se muestra una alerta de ingreso fallido', async () => {
    component.email = 'micorreo@correo.cl';
    component.password = 'prueba12345';
    const alertSpy = jasmine.createSpyObj('HTMLIonAlertElement', ['present']);
    alertControllerSpy.create.and.returnValue(Promise.resolve(alertSpy));

    authServiceSpy.login.and.returnValue(Promise.resolve(false));

    await component.login();

    expect(alertControllerSpy.create).toHaveBeenCalledWith({
      header: 'Error',
      message: 'Correo o contraseña incorrectos.',
      buttons: ['OK'],
    });
    expect(alertSpy.present).toHaveBeenCalled();
  });

  it('Redireccionar a la pagina de Registro', () => {
    component.redirectToSignUp();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/sign-up']);
  });
});