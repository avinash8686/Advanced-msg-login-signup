import { Injectable } from '@angular/core';


import { Observable } from 'rxjs/Observable';
import { Cookie } from 'ng2-cookies/ng2-cookies';

import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/toPromise';


import { HttpClient, HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AppService {

  public baseUrl = 'https://chatapi.edwisor.com';

  constructor(public _http:HttpClient) { }

  public getUserInfoFromLocalStorage : any = () => {
    let locallyStoredUserData = localStorage.getItem('userDetails')
    
    // JSON.parse is used to convert the string type of data to object type of data.
    let parsedData = JSON.parse(locallyStoredUserData);
    return parsedData;
  }

  public setUserInfoInLocalStorage : any = (userDetails) => {
    console.log(userDetails);
    localStorage.setItem('userDetails', JSON.stringify(userDetails));
  }

  public signUpService : any = (signedUpUserData) => {
    
    console.log(`Received data from signUp:`);
    console.log(signedUpUserData);

    const params = new HttpParams()
      .set('firstName', signedUpUserData.firstName)
      .set('lastName', signedUpUserData.lastName)
      .set('mobile', signedUpUserData.mobileNumber)
      .set('email', signedUpUserData.email)
      .set('password', signedUpUserData.password)
      .set('apiKey', signedUpUserData.apiKey)
  
    let signedUpData = this._http.post(`${this.baseUrl}/api/v1/users/signup`, params); 

    console.log(`signed Up Data Observable`);
    console.log(signedUpData);

    return signedUpData;
  }
  
  public signInService : any = (signedInUserData) => {
    
    console.log(`Received data from signIn:`);
    console.log(signedInUserData);

    const params = new HttpParams()
    .set('email', signedInUserData.email)
    .set('password', signedInUserData.password);
    
    let signedInData = this._http.post(`${this.baseUrl}/api/v1/users/login`, params);
    console.log(`Signed In Observable`);
    console.log(signedInData);

    return signedInData;
  }

  public logout(): Observable<any> {
    const params = new HttpParams ()
    .set('authToken', Cookie.get('authtoken'))

    return this._http.post(`${this.baseUrl}/api/v1/users/logout`, params);
  }


}
