import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MenuController } from '@ionic/angular';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent {
  constructor(
    private authService: AuthService,
    private router: Router,
    private menuCtrl: MenuController
  ) {}

  async logout() {
    this.authService.logout();
    await this.menuCtrl.close('mainMenu');
    this.router.navigate(['/login'], { replaceUrl: true });
  }
}