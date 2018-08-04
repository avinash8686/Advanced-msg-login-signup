import { Component, OnInit } from '@angular/core';

import { Router } from '@angular/router';
import { Cookie } from 'ng2-cookies/ng2-cookies';

import { ToastrService } from 'ngx-toastr';
import { SocketService } from '../../socket.service';
import { AppService } from '../../app.service';



@Component({
  selector: 'app-chat-box',
  templateUrl: './chat-box.component.html',
  styleUrls: ['./chat-box.component.css'],
  providers: [SocketService]
})
export class ChatBoxComponent implements OnInit {

  public authToken: any;
  public userInfo: any;
  public userList: any = [];
  public disconnectedSocket : boolean;

  public receiverId: any;
  public receiverName: any;

  public previousChatList : any = [];
  public messageText: any;
  public messageList : any = []; // Stores the current msg list displya in chat box
  public pageValue: number = 0;
  public loadingPreviousChat : boolean = false;


  constructor(public appService: AppService, public socketService:SocketService, public router: Router, public toastr: ToastrService) {
    this.receiverId = Cookie.get('receiverId');
    this.receiverName = Cookie.get('receiverName');
  }
  
  ngOnInit() {
    this.authToken = Cookie.get('authtoken');
    console.log(this.authToken);
    this.userInfo = this.appService.getUserInfoFromLocalStorage();
    console.log(this.userInfo);
    
    let Status = this.checkStatus();
    console.log(Status);
    
    this.verifyUserConfirmation();

    
    this.getMessageFromAUser();

    
    // this.getOnlineUserList();
  }

  public checkStatus: any = () => {
    if (Cookie.get('authtoken') === undefined || Cookie.get('authtoken') === '' || Cookie.get('authtoken') === null){
      this.router.navigate(['/']);
      return false;
    }
    else {
      return true;
    }
  }

  public verifyUserConfirmation: any = () => {

    this.socketService.verifyUser().subscribe(
      data => {
        console.log(data);
        this.disconnectedSocket = false;

        this.socketService.setUser(this.authToken);
        this.getOnlineUserList();
        
      },
      error => {
        console.log(error);
      }
    )
  }

  public getOnlineUserList :any = () => {
    this.socketService.onlineUserList().subscribe(
      data => {
        console.log(data);
        // for in loop iterates through properties of the object.
        
        // We need to initialize the userList array in here.
        // Bcoz the user is added to the existing array
        // If we declare it outside, the complete 
        
        this.userList = [];
        for(let x in data){
          // So x is ntg but the property
          console.log(x);
          
          // Accessing the value of a property
          console.log(data[x]);
          
          // if (data[x] === "rishabh singh"){
          //   continue;
          // }
          // else{
            // Making a temporary object for each user.
            let temp = {
              'userId': x,
              'name': data[x],
              'unread': 0,
              'chatting': false
            };
            console.log(temp);
            // making an object for each user that are signed in
            // Pushing each user(object) into a userList array/
            this.userList.push(temp);
            console.log(this.userList);
          // }

        }
      },
      error => {
        console.log(error);
      }
    )
  }


  public getPreviousChatWithAUser: any = () => {
    console.log(this.messageList);
    let previousData = (this.messageList.length > 0 ? this.messageList.slice() : []);

    this.socketService.getChat(this.userInfo.userId, this.receiverId, this.pageValue * 10)
      .subscribe(
        data => {
          if (data.status === 200) {
            this.messageList = data.data.concat(previousData);
          }
          else {
            this.messageList = previousData;
            this.toastr.warning('No messages available');
          }

          this.loadingPreviousChat = false;
        },
        error => {
          this.toastr.error('some error occured');
        }
      );
  } // end previous chat with any user.

  // function to loadEarlierPageOfChat

  public loadEarlierPageOfChat: any = () => {
    this.loadingPreviousChat = true;

    this.getPreviousChatWithAUser();
  }

  // From login page the cookies were set to the logged in user
  // if rajkumar logged in then receiverId, receiverName should be relate to rajkumar

  // When rajkumar thinks to chat with online users one at a time
  // the receiverId, receiverName will be updated to the friend as below.

  // Chat Related Methods.
  public userSelectedToChat: any = (id, name) =>{
    console.log('setting user as active');

    console.log(name);

    this.userList.map((user)=> {
      if(user.userId === id){
        user.chatting = true;
      }
      else {
        user.chatting = false;
      }
    })

    Cookie.set('receiverId', id);
    Cookie.set('receiverName', name);

    this.receiverName = name;
    this.receiverId = id;

    this.messageList = [];
    
    this.pageValue = 0;

    let chatDetails = {
      userId: this.userInfo.userId,
      senderId: id
    }

    this.socketService.markChatAsSeen(chatDetails);
    this.getPreviousChatWithAUser();
  }

  


  public sendMessageUsingKeypress:any = (event: any) => {
    console.log(event); 
    if((event as any).keyCode === 13 ) {
      // 13 is keycode of enter.
      this.sendMessage();
    }
  }

  public sendMessage: any = () => {
    if(this.messageText) {
      let chatMsgObject = {
        senderName: this.userInfo.firstName+ " " + this.userInfo.lastName,
        senderId: this.userInfo.userId,
        receiverName: Cookie.get('receiverName'),
        receiverId: Cookie.get('receiverId'),
        message: this.messageText,
        createdOn: new Date()
      } // end chatMsgObject
      console.log(chatMsgObject);
      this.socketService.SendChatMessage(chatMsgObject);
      this.pushToChatWindow(chatMsgObject);
      
    }
    else{
      this.toastr.warning('text message cannot be empty');
    }
  }

  public pushToChatWindow: any = (data)=>{
    // we are using another function and declaring empty messageText
    // Just to be sure that previous message should not include with the present one.
    this.messageText = "";
    this.messageList.push(data);
    console.log(this.messageList);
    
    
  } // end push to chat window

  public getMessageFromAUser: any = () => {
    console.log("Called me")
    this.socketService.chatByUserId(this.userInfo.userId).subscribe(
      data => {
      console.log(data);
      (this.receiverId == data.senderId)?this.messageList.push(data):'';
      
      console.log(this.messageList);
      this.toastr.success(`${data.senderName} says : ${data.message}`);


    },
    error => {
      console.log(error);
    }); // end subscribe.
  } // end get message from a user.


  public logout: any = () => {
    
    this.appService.logout().subscribe(
      data => {
        console.log(data);
      },
      error => {
        console.log(error);
      }
    )
  }

}
