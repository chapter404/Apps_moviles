import { Injectable } from '@angular/core';
import { SqliteService } from './sqlite.service'; 
import { BehaviorSubject, Observable } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private isAuthenticatedSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  constructor(
    private sqliteService: SqliteService,
    private router: Router
  ) {
    this.checkAuth();
  }

  private async checkAuth() {
    const email = await this.sqliteService.getPreference('userEmail');
    const password = await this.sqliteService.getPreference('userPassword');

    if (email && password) {
      const user = await this.sqliteService.query('users', 'email', email);
      if (user.length > 0 && user[0].password === password) {
        this.isAuthenticatedSubject.next(true);
      } else {
        await this.clearAuth();
      }
    } else {
      this.isAuthenticatedSubject.next(false);
    }
  }

  private async clearAuth() {
    await this.sqliteService.removePreference('userEmail');
    await this.sqliteService.removePreference('userPassword');
    this.isAuthenticatedSubject.next(false);
  }

  async login(email: string, password: string) {
    const user = await this.sqliteService.query('users', 'email', email);
    if (user.length > 0 && user[0].password === password) {
      await this.sqliteService.setPreference('userEmail', email);
      await this.sqliteService.setPreference('userPassword', password);
      this.isAuthenticatedSubject.next(true);
      return true;
    }
    return false;
  }

  async logout() {
    await this.clearAuth();
    this.router.navigate(['/login'], { replaceUrl: true });
  }

  get isAuthenticated$(): Observable<boolean> {
    return this.isAuthenticatedSubject.asObservable();
  }
}