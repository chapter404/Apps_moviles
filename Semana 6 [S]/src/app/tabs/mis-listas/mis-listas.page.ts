import { Component } from '@angular/core';
import { SqliteService } from '../../services/sqlite.service';

@Component({
  selector: 'app-mis-listas',
  templateUrl: 'mis-listas.page.html',
  styleUrls: ['mis-listas.page.scss'],
})
export class MisListasPage {
  public misListas: any[] = [];

  constructor(private sqlite: SqliteService) {}

  ionViewWillEnter() {
    this.loadMisListas();
  }

  async loadMisListas() {
    try {
      this.misListas = await this.sqlite.getMisListas();
    } catch (error) {
      console.error('Error al cargar Mis Listas:', error);
    }
  }
}
