import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { RecomendacionesPageRoutingModule } from './recomendaciones-routing.module';
import { RecomendacionesPage } from './recomendaciones.page';
import { SharedModule } from '../../shared/shared.module';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RecomendacionesPageRoutingModule,
    SharedModule
  ],
  declarations: [RecomendacionesPage]
})
export class RecomendacionesPageModule {}
