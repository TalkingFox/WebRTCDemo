import { TestBed, inject } from '@angular/core/testing';

import { RoomserviceService } from './roomservice.service';

describe('RoomserviceService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [RoomserviceService]
    });
  });

  it('should be created', inject([RoomserviceService], (service: RoomserviceService) => {
    expect(service).toBeTruthy();
  }));
});
