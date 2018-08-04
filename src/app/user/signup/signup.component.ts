import { Component, OnInit } from '@angular/core';
import { AppService } from '../../app.service';
import { Router } from '@angular/router';

import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

  public firstName: any;
  public lastName: any;
  public mobileNumber: any;
  public email: any;
  public password: any;
  public apiKey: any;

  constructor(public appService: AppService, public router: Router, private toastr: ToastrService) { }

  ngOnInit() {
  }

  public goToSignIn: any = () => {

    this.router.navigate(['/']);

    this.toastr.success('Now signIn', 'A/C Creation Successful');

  }

  public signUp: any = ()=>{

    if (!this.firstName) {
      this.toastr.warning('enter first name')


    } else if (!this.lastName) {
      this.toastr.warning('enter last name')

    } else if (!this.mobileNumber) {
      this.toastr.warning('enter mobile')

    } else if (!this.email) {
      this.toastr.warning('enter email')

    } else if (!this.password) {
      this.toastr.warning('enter password')


    } else if (!this.apiKey) {
      this.toastr.warning('Enter your API key')

    } else {

    let data = {
      firstName: this.firstName,
      lastName: this.lastName,
      mobile: this.mobileNumber,
      email: this.email,
      password: this.password,
      apiKey: this.apiKey,
    }

    console.log(`sending data from sign up to service:`);
    console.log(data);

    this.appService.signUpService(data).subscribe(
      data => {
        console.log(`Received signedUp Data from Observable`);
        console.log(data);

        if(data.status === 200){
          setTimeout(() => {
            this.goToSignIn();
          }, 1000);
        } else {

          this.toastr.error(data.message);

        }
      },
      error =>{
        this.toastr.error('some error occured');
        console.log(error);
      }
    );
  }
  }

}
