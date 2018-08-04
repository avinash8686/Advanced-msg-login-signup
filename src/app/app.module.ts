import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { RouterModule, Routes } from '@angular/router';
import { HttpClientModule } from '@angular/common/http'; 


import { AppComponent } from './app.component';
import { LoginComponent } from './user/login/login.component';
import { UserModule } from './user/user.module';
import { SharedModule } from './shared/shared.module';
import { ChatBoxModule } from './chat-box/chat-box.module';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { ToastrModule } from 'ngx-toastr';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    UserModule,
    SharedModule,
    ChatBoxModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot(),
    RouterModule.forRoot([
      {path: 'login', component: LoginComponent, pathMatch:'full'},
      {path: '', redirectTo:'login', pathMatch:'full'}
    ])
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
