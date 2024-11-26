import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BibliotecaPage } from './biblioteca.page';

const routes: Routes = [
  {
    path: '',
    component: BibliotecaPage,
  },
  {
    path: 'libros-leidos',
    loadChildren: () => import('./libros-leidos/libros-leidos.module').then(m => m.LibrosLeidosPageModule)
  },
  {
    path: 'libros-por-leer',
    loadChildren: () => import('./libros-por-leer/libros-por-leer.module').then(m => m.LibrosPorLeerPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BibliotecaPageRoutingModule {}
