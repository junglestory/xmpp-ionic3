import { Component } from '@angular/core';
import { XMPPService } from '../../app/xmpp.service';

@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html'
})
export class SettingsPage {

  constructor(public xmppService: XMPPService) {

  }

  logout(){
    this.xmppService.logout();
  }
}
