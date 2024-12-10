import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CapacitorSQLite, capSQLiteChanges, capSQLiteValues } from '@capacitor-community/sqlite';
import { Device } from '@capacitor/device';
import { Preferences } from '@capacitor/preferences';
import { BehaviorSubject } from 'rxjs';

interface Book {
  id?: number;
  title: string;
  author: string;
  coverImage: string;
}

interface Lista {
  id?: number;
  user_id: number;
  nombre: string;
  cantidad_libros?: number;
}

@Injectable({
  providedIn: 'root'
})
export class SqliteService {
  public dbReady: BehaviorSubject<boolean>;
  public isWeb: boolean;
  public isIOS: boolean;
  public dbName: string;

  constructor(private http: HttpClient) {
    this.dbReady = new BehaviorSubject(false);
    this.isWeb = false;
    this.isIOS = false;
    this.dbName = '';
  }

  async init() {
    const info = await Device.getInfo();
    const sqlite = CapacitorSQLite as any;

    if (info.platform == 'android') {
      try {
        await sqlite.requestPermissions();
      } catch (error) {
        console.error("Esta app necesita permisos para funcionar")
      }
    } else if (info.platform == 'web') {
      this.isWeb = true;
      await sqlite.initWebStore();
    } else if (info.platform == 'ios') {
      this.isIOS = true;
    }

    this.setupDatabase();
  }

  async setupDatabase() {
    const dbSetup = await Preferences.get({ key: 'first_setup_key' });
  
    if (!dbSetup.value) {
      await this.downloadDatabase();
      await this.insertTestUser();
    } else {
      this.dbName = await this.getDbName();
      await CapacitorSQLite.createConnection({ database: this.dbName });
      await CapacitorSQLite.open({ database: this.dbName });
      await this.insertTestUser();
      this.dbReady.next(true);
    }
  }

  async insertTestUser() {
    const testUser = {
      email: 'prueba@prueba.cl',
      password: 'prueba12345'
    };
  
    try {
      const userExists = await this.query('users', 'email', testUser.email);
      if (userExists.length === 0) {
        await this.registerUser(testUser.email, testUser.password);
        console.log('Usuario de prueba insertado correctamente');
      } else {
        console.log('El usuario de prueba ya existe');
      }
    } catch (error) {
      console.error('Error al insertar el usuario de prueba:', error);
    }
  }

  downloadDatabase() {
    this.http.get('assets/db/db.json').subscribe(async (jsonExport: any) => {
      const jsonstring = JSON.stringify(jsonExport);
      const isValid = await CapacitorSQLite.isJsonValid({ jsonstring });

      if (isValid.result) {
        this.dbName = jsonExport.database;
        await CapacitorSQLite.importFromJson({ jsonstring });
        await CapacitorSQLite.createConnection({ database: this.dbName });
        await CapacitorSQLite.open({ database: this.dbName })

        await Preferences.set({ key: 'first_setup_key', value: '1' })
        await Preferences.set({ key: 'dbname', value: this.dbName })

        this.dbReady.next(true);
      }
    })
  }

 
  async createLista(userId: number, nombre: string) {
    const sql = 'INSERT INTO listas (user_id, nombre) VALUES (?, ?)';
    const dbName = await this.getDbName();
    return CapacitorSQLite.executeSet({
      database: dbName,
      set: [{
        statement: sql,
        values: [userId, nombre]
      }]
    }).then((changes: capSQLiteChanges) => {
      if (this.isWeb) {
        CapacitorSQLite.saveToStore({ database: dbName });
      }
      return changes;
    });
  }

  async getListasUsuario(userId: number) {
    const sql = `
      SELECT l.*, COUNT(lb.id) as cantidad_libros 
      FROM listas l 
      LEFT JOIN lista_libros lb ON l.id = lb.lista_id 
      WHERE l.user_id = ? 
      GROUP BY l.id
    `;
    const dbName = await this.getDbName();
    return CapacitorSQLite.query({
      database: dbName,
      statement: sql,
      values: [userId]
    }).then((response: capSQLiteValues) => {
      return response.values || [];
    });
  }

  async addBookToLista(listaId: number, book: Book) {
    const sql = 'INSERT INTO lista_libros (lista_id, title, author, coverImage) VALUES (?, ?, ?, ?)';
    const dbName = await this.getDbName();
    return CapacitorSQLite.executeSet({
      database: dbName,
      set: [{
        statement: sql,
        values: [listaId, book.title, book.author, book.coverImage]
      }]
    }).then((changes: capSQLiteChanges) => {
      if (this.isWeb) {
        CapacitorSQLite.saveToStore({ database: dbName });
      }
      return changes;
    });
  }

  async getLibrosLista(listaId: number) {
    const sql = 'SELECT * FROM lista_libros WHERE lista_id = ?';
    const dbName = await this.getDbName();
    return CapacitorSQLite.query({
      database: dbName,
      statement: sql,
      values: [listaId]
    }).then((response: capSQLiteValues) => {
      return response.values || [];
    });
  }

  async deleteLista(listaId: number) {
    const dbName = await this.getDbName();
    return CapacitorSQLite.executeSet({
      database: dbName,
      set: [
        {
          statement: 'DELETE FROM lista_libros WHERE lista_id = ?',
          values: [listaId]
        },
        {
          statement: 'DELETE FROM listas WHERE id = ?',
          values: [listaId]
        }
      ]
    }).then((changes: capSQLiteChanges) => {
      if (this.isWeb) {
        CapacitorSQLite.saveToStore({ database: dbName });
      }
      return changes;
    });
  }

  async removeBookFromLista(listaId: number, bookId: number) {
    const sql = 'DELETE FROM lista_libros WHERE lista_id = ? AND id = ?';
    const dbName = await this.getDbName();
    return CapacitorSQLite.executeSet({
      database: dbName,
      set: [{
        statement: sql,
        values: [listaId, bookId]
      }]
    }).then((changes: capSQLiteChanges) => {
      if (this.isWeb) {
        CapacitorSQLite.saveToStore({ database: dbName });
      }
      return changes;
    });
  }


  async getCurrentUserId(): Promise<number | null> {
    const userEmail = await this.getPreference('userEmail');
    if (userEmail) {
      const users = await this.query('users', 'email', userEmail);
      return users.length > 0 ? users[0].id : null;
    }
    return null;
  }

  async registerUser(email: string, password: string) {
    const dbName = await this.getDbName();
    const sql = 'INSERT INTO users (email, password) VALUES (?, ?)';
    return CapacitorSQLite.executeSet({
      database: dbName,
      set: [{
        statement: sql,
        values: [email, password]
      }]
    }).then((changes: capSQLiteChanges) => {
      if (this.isWeb) {
        CapacitorSQLite.saveToStore({ database: dbName });
      }
      return changes;
    });
  }

  async loginUser(email: string, password: string) {
    const sql = 'SELECT * FROM users WHERE email = ? AND password = ?';
    const dbName = await this.getDbName();
    return CapacitorSQLite.query({
      database: dbName,
      statement: sql,
      values: [email, password]
    }).then((response: capSQLiteValues) => {
      return response.values && response.values.length > 0;
    });
  }


  async getDbName() {
    if (!this.dbName) {
      const dbname = await Preferences.get({ key: 'dbname' })
      if (dbname.value) {
        this.dbName = dbname.value
      }
    }
    return this.dbName;
  }

  async query(table: string, column: string, value: any) {
    const sql = `SELECT * FROM ${table} WHERE ${column} = ?`;
    const dbName = await this.getDbName();
    return CapacitorSQLite.query({
      database: dbName,
      statement: sql,
      values: [value]
    }).then((response: capSQLiteValues) => {
      return response.values || [];
    });
  }


  async setPreference(key: string, value: string) {
    await Preferences.set({ key, value });
  }

  async getPreference(key: string) {
    const result = await Preferences.get({ key });
    return result.value;
  }

  async removePreference(key: string) {
    await Preferences.remove({ key });
  }
}