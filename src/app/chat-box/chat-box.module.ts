import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChatBoxComponent } from './chat-box/chat-box.component';
import { FormsModule } from '@angular/forms';

import { RouterModule, Routes } from '@angular/router';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild([
      {path:'chatbox', component:ChatBoxComponent}
    ])
  ],
  declarations: [ChatBoxComponent]
})
export class ChatBoxModule { }
