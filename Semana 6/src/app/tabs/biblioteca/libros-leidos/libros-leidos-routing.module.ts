import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LibrosLeidosPage } from './libros-leidos.page';

const routes: Routes = [
  {
    path: '',
    component: LibrosLeidosPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LibrosLeidosPageRoutingModule {}
