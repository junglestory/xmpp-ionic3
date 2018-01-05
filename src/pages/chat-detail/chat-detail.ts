import { Component, OnInit, ViewChild} from '@angular/core';
import { IonicPage, NavParams, ModalController } from 'ionic-angular';
import { XMPPService } from '../../app/xmpp.service';
import { Events } from 'ionic-angular';
import { Content } from 'ionic-angular';
import { ChatInvitePage } from '../chat-invite/chat-invite';

@Component({
  selector: 'page-chat-detail',
  templateUrl: 'chat-detail.html',
})
export class ChatDetailPage {
  private roomJid: string = "";
  private messages : Array<Object> = [];
  private tabBarElement: any;
  private userId: string = "";
  private message: string = "";
  private roomName: string = "";

  @ViewChild(Content) content: Content;

  constructor(public navParams: NavParams, public xmppService: XMPPService, public events: Events, public modalCtrl: ModalController) {
  	this.roomJid = navParams.get('id');
  	this.tabBarElement = document.querySelector('.tabbar.show-tabbar');

  	events.subscribe('message', message => {
  		this.messages.push(message);

  		setTimeout(() => {
	  		if(this.content._scroll) {
	  			this.content.scrollToBottom(300);
	  		}
	    }, 0);
	});
  }

  ngOnInit() {
    this.xmppService.join(this.roomJid);
    this.userId = this.xmppService.getNick();
    this.roomName = this.xmppService.getRoomName();
  }

  sendMessage() {
  	this.xmppService.sendMessage(this.roomJid, this.message);
  	this.message = "";
  }

  openModal() {
    let inviteModal = this.modalCtrl.create(ChatInvitePage);

    inviteModal.onDidDismiss(jId => {
      this.xmppService.invite(this.roomJid, jId);
    });

    inviteModal.present();
  }

  ionViewWillEnter() {
    this.tabBarElement.style.display = 'none';
  }
 
  ionViewWillLeave() {
    this.tabBarElement.style.display = 'flex';
  }
}
