import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { LibrosLeidosPageRoutingModule } from './libros-leidos-routing.module';

import { LibrosLeidosPage } from './libros-leidos.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    LibrosLeidosPageRoutingModule
  ],
  declarations: [LibrosLeidosPage]
})
export class LibrosLeidosPageModule {}
