import { Component, OnInit } from '@angular/core';
import { ViewWillEnter } from '@ionic/angular';
import { SqliteService } from '../../services/sqlite.service';
import { Geolocation } from '@capacitor/geolocation';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-mis-listas',
  templateUrl: 'mis-listas.page.html',
  styleUrls: ['mis-listas.page.scss'],
})
export class MisListasPage implements OnInit, ViewWillEnter {
  public listas: any[] = [];
  public userId: number | null = null;
  public titulo: string = '';

  constructor(
    private sqlite: SqliteService,
    private authService: AuthService,
    private router: Router
  ) {
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

  async getCurrentLocation() {
    const coordinates = await Geolocation.getCurrentPosition();
    console.log('Current position:', coordinates);
  }

  async logout() {
    this.authService.logout();
    this.router.navigate(['/login'], { replaceUrl: true });
  }

  onSearchInput() {
  }
}