import { Component, OnInit } from '@angular/core';
import { ViewWillEnter } from '@ionic/angular';
import { SqliteService } from '../../services/sqlite.service';

@Component({
  selector: 'app-mis-listas',
  templateUrl: 'mis-listas.page.html',
  styleUrls: ['mis-listas.page.scss'],
})

export class MisListasPage implements OnInit, ViewWillEnter {
  public listas: any[] = [];
  public userId: number | null = null;

  constructor(private sqlite: SqliteService) {
    this.initializeUser();
  }

  ngOnInit() {
    this.initializeUser();
  }

  async ionViewWillEnter() {
    if (this.userId) {
      await this.loadListas();
    }
  }

  private async initializeUser() {
    this.userId = await this.sqlite.getCurrentUserId();
    if (this.userId) {
      await this.loadListas();
    }
  }

  async loadListas() {
    if (!this.userId) return;
    try {
      const lists = await this.sqlite.getListasUsuario(this.userId);
      this.listas = await Promise.all(lists.map(async (lista: any) => {
        const books = await this.sqlite.getLibrosLista(lista.id);
        return {
          ...lista,
          books,
          cantidad_libros: books.length
        };
      }));
    } catch (error) {
      console.error('Error al cargar listas:', error);
    }
  }
}