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
  private id: string = "";
  private messages : Array<Object> = [];
  private tabBarElement: any;
  private userId: string = "";
  private message: string = "";

  @ViewChild(Content) content: Content;

  constructor(public navParams: NavParams, public xmppService: XMPPService, public events: Events, public modalCtrl: ModalController) {
  	this.id = navParams.get('id');
  	this.tabBarElement = document.querySelector('.tabbar.show-tabbar');

  	events.subscribe('message', message => {
  		this.messages.push(message);
  		setTimeout(() => {
	        this.content.scrollToBottom(300);
	     }, 0);
	});
  }

  ngOnInit() {
    this.xmppService.join(this.id);
    this.userId = this.xmppService.getNick();
  }

  sendMessage() {
  	this.xmppService.sendMessage(this.id, this.message);
  	this.message = "";
  }

  openModal() {
    let inviteModal = this.modalCtrl.create(ChatInvitePage);

    inviteModal.onDidDismiss(jId => {
     console.log(jId);
      //this.inviteModal(jId)
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
