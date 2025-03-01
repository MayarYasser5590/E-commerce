import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import {jwtDecode} from 'jwt-decode'
import { log } from 'console';
import { IUserData } from '../../../shared/interfaces/iuser-data';
import { Router } from '@angular/router';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  userData:IUserData = {} as IUserData; 
  private readonly _Router = inject(Router);

  constructor( private httpClient : HttpClient) { }
  sendRegisterForm(data : object):Observable<any>
  {
   return  this.httpClient.post(`${environment.baseUrl}/api/v1/auth/signup` , data);
  }
  sendLoginForm(data : object):Observable<any>
  {
   return  this.httpClient.post(`${environment.baseUrl}/api/v1/auth/signin` , data);
  }

  saveUserData():boolean{
    if (localStorage.getItem('userToken') !== null) {
    this.userData =  jwtDecode(localStorage.getItem('userToken') ! );
    console.log(this.userData);
    return true;
    }else{
      return false;
    }
  }
  

  logOut():void{
    localStorage.removeItem('userToken');
    localStorage.removeItem('cartId');
    this.userData = {} as IUserData;
    this._Router.navigate(['/login']);
  }

  setEmailVerify(data : object):Observable<any>
  {
   return this.httpClient.post(`${environment.baseUrl}/api/v1/auth/forgotPasswords` , data)
  }

  setCodeVerify(data : object):Observable<any>
  {
   return this.httpClient.post(`${environment.baseUrl}/api/v1/auth/verifyResetCode` , data)
  }

  setResetPassword(data : object):Observable<any>
  {
   return this.httpClient.put(`${environment.baseUrl}/api/v1/auth/resetPassword` , data)
  }

}
