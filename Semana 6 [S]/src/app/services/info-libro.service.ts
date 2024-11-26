import { Injectable } from '@angular/core';
import { CapacitorHttp, HttpOptions, HttpResponse } from '@capacitor/core';

@Injectable({
  providedIn: 'root'
})
export class InfoLibroService {

  constructor() { }

  getLibros(titulo: string, autor?: string, idioma?: string) {
    let query = `q=${encodeURIComponent(titulo)}`;
    if (autor) {
      query += `+inauthor:${encodeURIComponent(autor)}`;
    }
    if (idioma) {
      query += `&langRestrict=${encodeURIComponent(idioma)}`;
    }

    const options: HttpOptions = {
      url: `https://www.googleapis.com/books/v1/volumes?${query}`,
      params: {}
    };

    return CapacitorHttp.get(options).then((response: HttpResponse) => {
      const items = response.data.items || [];
      return items.map((item: any) => ({
        title: item.volumeInfo.title || 'Sin título',
        author: item.volumeInfo.authors ? item.volumeInfo.authors.join(', ') : 'Autor desconocido',
        coverImage: item.volumeInfo.imageLinks?.thumbnail || 'assets/default-cover.png',
      }));
    });
  }
}
