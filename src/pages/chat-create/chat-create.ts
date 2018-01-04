import { Component } from '@angular/core';
import { IonicPage, NavParams, ViewController } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-chat-create',
  templateUrl: 'chat-create.html',
})
export class ChatCreatePage {
  private name: string = "";

  constructor(private navParams: NavParams, private view: ViewController) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ChatCreatePage');
  }

  closeModal() {
    this.view.dismiss("");
  }

  createRoom() {  	
    this.view.dismiss(this.name);
  }
}
