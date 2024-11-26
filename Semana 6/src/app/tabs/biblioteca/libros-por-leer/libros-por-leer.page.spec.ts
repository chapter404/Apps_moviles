import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LibrosPorLeerPage } from './libros-por-leer.page';

describe('LibrosPorLeerPage', () => {
  let component: LibrosPorLeerPage;
  let fixture: ComponentFixture<LibrosPorLeerPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(LibrosPorLeerPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
