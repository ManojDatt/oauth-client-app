import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { throwError, BehaviorSubject } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
import * as CryptoJS from '../../node_modules/crypto-js'; 
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private SERVER_URL = environment.apiUrl;

  constructor(private httpClient: HttpClient) { }

  handleError(error: HttpErrorResponse) {
    let errorMessage = 'Unknown error!';
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Error: ${error.error.message}`;
    } else {
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    window.alert(errorMessage);
    return throwError(errorMessage);
  }

  public loggedIn = new BehaviorSubject<boolean>(false)// {1}

  public isLoggedIn(){
     if(localStorage.getItem('secData') !== null){
      this.loggedIn.next(true)
    }
    else{
      this.loggedIn.next(false)
    }
    console.log(this.loggedIn)
    return this.loggedIn
  }
  
  plainHeaderOption = {
    headers: new HttpHeaders({
      'Content-Type':  'application/json',
    })
  }
  
  autheticatedHeader(){
    var authHeaderOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        'Authorization': "Bearer "+this.getAuthToken()
      })
    }
    return authHeaderOptions
  }

  getAuthToken(){
    var sci_token = localStorage.getItem('secData')
    if (sci_token === null){
      return ""
    }
    var loginDetails = JSON.parse(atob(sci_token))
    return loginDetails.access_token
  }

  getUserProfile(){
    var sci_data = localStorage.getItem('_PDATA')
    if(sci_data !== null){
      return JSON.parse(CryptoJS.AES.decrypt(sci_data, "$34552Bfgdg@$@$#%@B@#$%#@%").toString(CryptoJS.enc.Utf8))
    }
    return {}
  }

  storeUserProfile(data: any): void{
    var authData = CryptoJS.AES.encrypt(JSON.stringify(data),"$34552Bfgdg@$@$#%@B@#$%#@%").toString()
    localStorage.setItem('_PDATA', authData)
    this.loggedIn.next(true)
  }

  logOut(){
    localStorage.removeItem('_PDATA')
    localStorage.removeItem('secData')
    this.loggedIn.next(false)
  }
// Apis list

  public userDetail() {
    return this.httpClient.get(this.SERVER_URL+"profile", this.autheticatedHeader()).pipe(catchError(this.handleError));
  }
  public taskList() {
    return this.httpClient.get(this.SERVER_URL+"list", this.autheticatedHeader()).pipe(catchError(this.handleError));
  }

  public usersList() {
    return this.httpClient.get(this.SERVER_URL+"users", this.autheticatedHeader()).pipe(catchError(this.handleError));
  }

  public addTask(data:any) {
    return this.httpClient.post(this.SERVER_URL+"create", data, this.autheticatedHeader()).pipe(catchError(this.handleError));
  }

  public updateTask(task:number, data:any) {
    return this.httpClient.post(this.SERVER_URL+task.toString()+"/update", data, this.autheticatedHeader()).pipe(catchError(this.handleError));
  }

  public deleteTask(task:number) {
    return this.httpClient.get(this.SERVER_URL+task.toString()+"/delete", this.autheticatedHeader()).pipe(catchError(this.handleError));
  }

  public signupUser(data:any) {
    return this.httpClient.post(this.SERVER_URL+"signup", data, this.autheticatedHeader()).pipe(catchError(this.handleError));
  }
}


