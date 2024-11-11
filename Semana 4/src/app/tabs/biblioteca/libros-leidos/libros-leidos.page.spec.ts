import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LibrosLeidosPage } from './libros-leidos.page';

describe('LibrosLeidosPage', () => {
  let component: LibrosLeidosPage;
  let fixture: ComponentFixture<LibrosLeidosPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(LibrosLeidosPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
