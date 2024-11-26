import { Injectable } from '@angular/core';
import { SqliteService } from './sqlite.service'; 
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private isAuthenticatedSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  constructor(private sqliteService: SqliteService) {
    this.checkAuth();
  }

  private async checkAuth() {
    const dbName = await this.sqliteService.getDbName();
    const email = await this.sqliteService.getPreference('userEmail');
    const password = await this.sqliteService.getPreference('userPassword');

    if (email && password) {
      const user = await this.sqliteService.query('users', 'email', email);
      if (user.length > 0 && user[0].password === password) {
        this.isAuthenticatedSubject.next(true);
      } else {
        this.isAuthenticatedSubject.next(false);
      }
    } else {
      this.isAuthenticatedSubject.next(false);
    }
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

  logout() {
    this.sqliteService.removePreference('userEmail');
    this.sqliteService.removePreference('userPassword');
    this.isAuthenticatedSubject.next(false);
  }

  get isAuthenticated$(): Observable<boolean> {
    return this.isAuthenticatedSubject.asObservable();
  }
  
}
