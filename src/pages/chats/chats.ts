import { Component, OnInit} from '@angular/core';
import { NavController } from 'ionic-angular';
import { XMPPService } from '../../app/xmpp.service';

@Component({
  selector: 'page-chats',
  templateUrl: 'chats.html'
})
export class ChatsPage {

  constructor(public navCtrl: NavController, public xmppService: XMPPService) {

  }

  ngOnInit() {
    console.log(this.xmppService.getRooms());
  }
}
