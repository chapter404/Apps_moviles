import { Injectable } from '@angular/core';
import { CapacitorHttp, HttpOptions, HttpResponse } from '@capacitor/core';


@Injectable({
  providedIn: 'root'
})
export class InfoLibroService {
  constructor() { }

  getLibros(titulo: string, autor?: string, idioma?: string) {
    if (!titulo && !autor) {
      return Promise.resolve([]); 
    }
  
    let query = '';
    
    if (titulo) {
      query = `q=${encodeURIComponent(titulo.trim())}`;
    }
    
    if (autor) {
      query = query ? 
        `${query}+inauthor:${encodeURIComponent(autor)}` : 
        `q=inauthor:${encodeURIComponent(autor)}`;
    }
    
    if (idioma) {
      query += `&langRestrict=${encodeURIComponent(idioma)}`;
    }
  
    const options: HttpOptions = {
      url: `https://www.googleapis.com/books/v1/volumes?${query}`,
      params: {}
    };

    console.log('URL con la solicitud:', options.url);
  
    return CapacitorHttp.get(options).then((response: HttpResponse) => {
      console.log('Respuesta a la solicitud:', response);
      const items = response.data.items || [];
      const result = items.map((item: any) => ({
        title: item.volumeInfo.title || 'Sin título',
        author: item.volumeInfo.authors ? item.volumeInfo.authors.join(', ') : 'Autor desconocido',
        coverImage: this.processImageUrl(item.volumeInfo.imageLinks?.thumbnail),
      }));
      console.log('Resultado procesado:', result);
      return result;
    });
  }

  private processImageUrl(url: string | undefined): string {
    if (!url) {
      return 'assets/covers/default.jpg';
    }
    return url.replace('http://', 'https://');
  }
}