import { Component, OnInit} from '@angular/core';
import { NavController, ModalController } from 'ionic-angular';
import { XMPPService } from '../../app/xmpp.service';
import { ChatDetailPage } from '../chat-detail/chat-detail';
import { ChatCreatePage } from '../chat-create/chat-create';

@Component({
  selector: 'page-chats',
  templateUrl: 'chats.html'
})
export class ChatsPage {
  private chats : Array<Object> = [];

  constructor(public navCtrl: NavController, public xmppService: XMPPService, public modalCtrl: ModalController) {

  }

  ngOnInit() {
    this.xmppService.allRoster().then(value => {
    	this.chats = value; 
    });
  }

  openModal() {
    let createModal = this.modalCtrl.create(ChatCreatePage);

    createModal.onDidDismiss(name => {    
      this.createRoom(name);
    });

    createModal.present();
  }

  chatDetail(roomJid, roomName) {
    if (roomName !== "") {
      this.xmppService.setRoomName(roomName);
    }

  	this.navCtrl.push(ChatDetailPage, {
      id: roomJid
    });
  }

  createRoom(name) {
  	let roomJid = this.xmppService.create(name);

  	setTimeout(() => {
  		this.chatDetail(roomJid, "");
  	}, 1000);
  }
}
