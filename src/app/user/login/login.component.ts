import { Component, OnInit } from '@angular/core';
import { AppService } from '../../app.service';
import { Router } from '@angular/router';

import { ToastrService } from 'ngx-toastr';

import { Cookie } from 'ng2-cookies';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  public email: any;
  public password: any;

  constructor(public appService: AppService, public router: Router, private toastr: ToastrService) { }

  ngOnInit() {
  }

  public goToSignUp: any = () => {

    this.router.navigate(['/signup']);

  } 

  public signIn : any = () => {
    
    if (!this.email) {
      this.toastr.warning('enter email')


    } else if (!this.password) {

      this.toastr.warning('enter password')


    } else {

    let data = {
      email: this.email,
      password: this.password
    }

    console.log(`sending data from sign in to service:`);
    console.log(data);

    this.appService.signInService(data).subscribe(
      data => {

        if(data.status === 200){
          console.log(`Received signedIn Data from Observable`);
          console.log(data);
          console.log(data.data.authToken);


          // We should store the data that we want to reuse in our app
          // We can directly get the data from cookie and display it,
          // rather than calling some function and getting the data out of it,
          // Why to reinvent the wheel, when you can reuse the wheel.
          Cookie.set('authtoken', data.data.authToken);
          Cookie.set('receiverId', data.data.userDetails.userId);
          Cookie.set('receiverName', data.data.userDetails.firstName + ' ' + data.data.userDetails.lastName);
          // end of setting up the cookies.

          this.appService.setUserInfoInLocalStorage(data.data.userDetails);

          this.router.navigate(['/chatbox']);
          this.toastr.success("Successfully Logged In");
        } 
        else {
          this.toastr.error(data.message);
        }
      },
      error => {
        this.toastr.error('some error occured');
        console.log(error);
      }
    );

  }

  }
}
