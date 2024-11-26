import { TestBed } from '@angular/core/testing';

import { InfoLibroService } from './info-libro.service';

describe('InfoLibroService', () => {
  let service: InfoLibroService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InfoLibroService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
