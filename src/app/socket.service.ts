import { Injectable } from '@angular/core';

import * as io from 'socket.io-client';

import { Cookie } from 'ng2-cookies/ng2-cookies';

import { Observable } from 'rxjs/Observable';

import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/toPromise';

import { HttpClient, HttpParams, HttpErrorResponse } from '@angular/common/http';



@Injectable({
  providedIn: 'root'
})
export class SocketService {

  private url = 'https://chatapi.edwisor.com';

  private socket;

  constructor(public _http: HttpClient) { 
    // Connection is being created.
    //  that hand shake
    this.socket = io(this.url);
  }

  public verifyUser = () => {
    let subscription = Observable.create((obs) => {
      this.socket.on('verifyUser', (data) => {
        obs.next(data);
      });
    });
    return subscription;
  }
  
  public onlineUserList = () => {
    let subscription = Observable.create((obs) => {
      this.socket.on("online-user-list", (userList)=> {
        console.log(userList);
        obs.next(userList);
      });
    });
    return subscription;
  }

  public disconnectedSocket = () => {
    let subscription = Observable.create((obs) => {
      this.socket.on('disconnect', () =>{
        obs.next();
      }); //end Socket
    }); // end Observable
  } // end disconnectedSocket

  public setUser = (authToken) => {
    this.socket.emit("set-user", authToken);
  }


  public markChatAsSeen = (userDetails) => {
    console.log(userDetails);
    this.socket.emit('mark-chat-as-seen', userDetails);

  } // end markChatAsSeen

  public getChat(senderId, receiverId, skip): Observable<any> {
    return this._http.get(`${this.url}/api/v1/chat/get/for/user?senderId=${senderId}&
    receiverId=${receiverId}&skip=${skip}&authToken=${Cookie.get('authtoken')}`)
    .do(data => console.log('Data Received'))
      .catch(this.handleError);
  }

  public chatByUserId = (userId) => {
    console.log(userId);
    return Observable.create((observer) => {

      this.socket.on(userId, (data) => {

        observer.next(data);

      }); // end Socket

    }); // end Observable
    // console.log(subscription)
    // return subscription;

  } // end chatByUserId


  public SendChatMessage = (chatMsgObject) => {
    this.socket.emit('chat-msg', chatMsgObject);
  } // end getChatMessage

  public exitSocket = () => {

    this.socket.disconnect();
  
  } // end exit socket.

  private handleError(err: HttpErrorResponse) {
    let errorMessage = '';

    if(err.error instanceof Error){
      errorMessage = `An error occured: ${err.error.message}`;
    } 
    else{
      errorMessage = `Server returned code: ${err.status}, error message is: ${err.message}`;
    } // end condition *if

    console.error(errorMessage);

    return Observable.throw(errorMessage);
  } // END handleError
}
