import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ChatCreatePage } from './chat-create';

@NgModule({
  declarations: [
    ChatCreatePage,
  ],
  imports: [
    IonicPageModule.forChild(ChatCreatePage),
  ],
})
export class ChatCreatePageModule {}
