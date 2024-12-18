import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LibrosPorLeerPage } from './libros-por-leer.page';

const routes: Routes = [
  {
    path: '',
    component: LibrosPorLeerPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LibrosPorLeerPageRoutingModule {}
