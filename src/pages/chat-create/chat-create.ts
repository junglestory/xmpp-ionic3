import { Component } from '@angular/core';
import { IonicPage, ViewController } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-chat-create',
  templateUrl: 'chat-create.html',
})
export class ChatCreatePage {
  private name: string = "";

  constructor(private view: ViewController) {
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
