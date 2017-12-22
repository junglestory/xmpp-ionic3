import { TestBed, inject } from '@angular/core/testing';
import { XMPPService } from './xmpp.service';

describe('XMPPService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [XMPPService]
    });
  });

  it('should be created', inject([XMPPService], (service: XMPPService) => {
    expect(service).toBeTruthy();
  }));
});