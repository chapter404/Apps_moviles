import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CapacitorSQLite, capSQLiteChanges, capSQLiteValues } from '@capacitor-community/sqlite';
import { Device } from '@capacitor/device';
import { Preferences } from '@capacitor/preferences';
import { JsonSQLite } from 'jeep-sqlite/dist/types/interfaces/interfaces';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SqliteService {


  public dbReady: BehaviorSubject<boolean>;
  public isWeb: boolean;
  public isIOS: boolean;
  public dbName: string;

  constructor(
    private http: HttpClient
  ) {
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

    const dbSetup = await Preferences.get({ key: 'first_setup_key' })

    if (!dbSetup.value) {
      this.downloadDatabase();
    } else {
      this.dbName = await this.getDbName();
      await CapacitorSQLite.createConnection({ database: this.dbName });
      await CapacitorSQLite.open({ database: this.dbName })
      this.dbReady.next(true);
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

  async getDbName() {

    if (!this.dbName) {
      const dbname = await Preferences.get({ key: 'dbname' })
      if (dbname.value) {
        this.dbName = dbname.value
      }
    }
    return this.dbName;
  }

  async create(table: string, fields: string[], values: any[]) {
    const placeholders = fields.map(() => '?').join(', ');
    const sql = `INSERT INTO ${table} (${fields.join(', ')}) VALUES (${placeholders})`;
    const dbName = await this.getDbName();
    
    return CapacitorSQLite.executeSet({
      database: dbName,
      set: [
        {
          statement: sql,
          values: values
        }
      ]
    }).then((changes: capSQLiteChanges) => {
      if (this.isWeb) {
        CapacitorSQLite.saveToStore({ database: dbName });
      }
      return changes;
    }).catch(err => Promise.reject(err));
  }
  

  async read(table: string, column: string) {
    const sql = `SELECT ${column} FROM ${table}`;
    const dbName = await this.getDbName();
    
    return CapacitorSQLite.query({
      database: dbName,
      statement: sql,
      values: []
    }).then((response: capSQLiteValues) => {
      let values: any[] = [];
  
      if (this.isIOS && response.values && response.values.length > 0) {
        response.values.shift();
      }
  
      if (response.values) {
        response.values.forEach(item => values.push(item[column]));
      }
      return values;
    }).catch(err => Promise.reject(err));
  }
  

  async update(table: string, column: string, newValue: any, conditionColumn: string, conditionValue: any) {
    const sql = `UPDATE ${table} SET ${column} = ? WHERE ${conditionColumn} = ?`;
    const dbName = await this.getDbName();
    
    return CapacitorSQLite.executeSet({
      database: dbName,
      set: [
        {
          statement: sql,
          values: [newValue, conditionValue]
        }
      ]
    }).then((changes: capSQLiteChanges) => {
      if (this.isWeb) {
        CapacitorSQLite.saveToStore({ database: dbName });
      }
      return changes;
    }).catch(err => Promise.reject(err));
  }

  
  async delete(table: string, conditionColumn: string, conditionValue: any) {
    const sql = `DELETE FROM ${table} WHERE ${conditionColumn} = ?`;
    const dbName = await this.getDbName();
    
    return CapacitorSQLite.executeSet({
      database: dbName,
      set: [
        {
          statement: sql,
          values: [conditionValue]
        }
      ]
    }).then((changes: capSQLiteChanges) => {
      if (this.isWeb) {
        CapacitorSQLite.saveToStore({ database: dbName });
      }
      return changes;
    }).catch(err => Promise.reject(err));
  }


  async addBook(book: { title: string; author: string; coverImage: string }) {
    const sql = 'INSERT INTO books (title, author, coverImage) VALUES (?, ?, ?)';
    const dbName = await this.getDbName();
    return CapacitorSQLite.executeSet({
      database: dbName,
      set: [
        {
          statement: sql,
          values: [book.title, book.author, book.coverImage],
        },
      ],
    }).then((changes: capSQLiteChanges) => {
      if (this.isWeb) {
        CapacitorSQLite.saveToStore({ database: dbName });
      }
      return changes;
    }).catch(err => Promise.reject(err));
  }

  async getBooks() {
    const sql = 'SELECT * FROM books';
    const dbName = await this.getDbName();
    return CapacitorSQLite.query({
      database: dbName,
      statement: sql,
      values: [],
    }).then((response: capSQLiteValues) => {
      return response.values || [];
    }).catch(err => Promise.reject(err));
  }

  async deleteBook(bookId: number) {
    const sql = 'DELETE FROM books WHERE id = ?';
    const dbName = await this.getDbName();
    return CapacitorSQLite.executeSet({
      database: dbName,
      set: [
        {
          statement: sql,
          values: [bookId],
        },
      ],
    }).then((changes: capSQLiteChanges) => {
      if (this.isWeb) {
        CapacitorSQLite.saveToStore({ database: dbName });
      }
      return changes;
    }).catch(err => Promise.reject(err));
  }


  async addBookToMisList(book: { title: string; author: string; coverImage: string }) {
    const sql = 'INSERT INTO mis_listas (title, author, coverImage) VALUES (?, ?, ?)';
    const dbName = await this.getDbName();
    return CapacitorSQLite.executeSet({
      database: dbName,
      set: [
        {
          statement: sql,
          values: [book.title, book.author, book.coverImage],
        },
      ],
    }).then((changes: capSQLiteChanges) => {
      if (this.isWeb) {
        CapacitorSQLite.saveToStore({ database: dbName });
      }
      return changes;
    }).catch(err => Promise.reject(err));
  }


  async getMisListas() {
    const sql = 'SELECT * FROM mis_listas';
    const dbName = await this.getDbName();
    return CapacitorSQLite.query({
      database: dbName,
      statement: sql,
      values: [],
    }).then((response: capSQLiteValues) => {
      return response.values || [];
    }).catch(err => Promise.reject(err));
  }


  async query(table: string, column: string, value: any) {
    const sql = `SELECT * FROM ${table} WHERE ${column} = ?`;
    const dbName = await this.getDbName();
  
    return CapacitorSQLite.query({
      database: dbName,
      statement: sql,
      values: [value],
    }).then((response: capSQLiteValues) => {
      return response.values || [];
    }).catch(err => Promise.reject(err));
  }
  

  async registerUser(email: string, password: string) {
    const dbName = await this.getDbName();
    const sql = 'INSERT INTO users (email, password) VALUES (?, ?)';
    return CapacitorSQLite.executeSet({
      database: dbName,
      set: [
        {
          statement: sql,
          values: [email, password],
        },
      ],
    }).then((changes: capSQLiteChanges) => {
      if (this.isWeb) {
        CapacitorSQLite.saveToStore({ database: dbName });
      }
      return changes;
    }).catch((err) => Promise.reject(err));
  }


  async loginUser(email: string, password: string) {
    const dbName = await this.getDbName();
    const sql = 'SELECT * FROM users WHERE email = ? AND password = ?';
    return CapacitorSQLite.query({
      database: dbName,
      statement: sql,
      values: [email, password],
    }).then((response: capSQLiteValues) => {
      if (response.values && response.values.length > 0) {
        return true;
      }
      return false;
    }).catch((err) => Promise.reject(err));
  }


  async getUsers() {
    const dbName = await this.getDbName();
    const sql = 'SELECT * FROM users';
    return CapacitorSQLite.query({
      database: dbName,
      statement: sql,
      values: [],
    }).then((response: capSQLiteValues) => {
      return response.values || [];
    }).catch((err) => Promise.reject(err));
  }


  setToken(token: string) {
    Preferences.set({ key: 'auth_token', value: token });
  }


  isAuthenticated(): Promise<boolean> {
    return Preferences.get({ key: 'auth_token' }).then((result) => {
      return result.value !== null;
    });
  }


  logout() {
    Preferences.remove({ key: 'auth_token' });
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