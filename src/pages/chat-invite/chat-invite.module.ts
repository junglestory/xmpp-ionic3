import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ChatInvitePage } from './chat-invite';

@NgModule({
  declarations: [
    ChatInvitePage,
  ],
  imports: [
    IonicPageModule.forChild(ChatInvitePage),
  ],
})
export class ChatInvitePageModule {}
