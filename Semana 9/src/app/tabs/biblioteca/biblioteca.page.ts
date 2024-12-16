import { Component } from '@angular/core';
import { Geolocation } from '@capacitor/geolocation';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-biblioteca',
  templateUrl: './biblioteca.page.html',
  styleUrls: ['./biblioteca.page.scss'],
})
export class BibliotecaPage {
  public titulo: string = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

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