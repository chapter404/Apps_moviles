import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { LibrosPorLeerPageRoutingModule } from './libros-por-leer-routing.module';

import { LibrosPorLeerPage } from './libros-por-leer.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    LibrosPorLeerPageRoutingModule
  ],
  declarations: [LibrosPorLeerPage]
})
export class LibrosPorLeerPageModule {}
