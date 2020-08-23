import { Injectable } from '@angular/core';
import { UserService } from './user.service';
import { Observable, of ,EMPTY} from 'rxjs';
import { mergeMap, catchError} from 'rxjs/operators'
import { Resolve, RouterStateSnapshot } from '@angular/router';
import { ActivatedRouteSnapshot } from '@angular/router';

@Injectable({
    providedIn: 'root'
  })

export class AuthResolver implements Resolve<any> {
  constructor(private userService: UserService) {}
  public userDetail:any = {}
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Observable<never>  {
        let secData = route.queryParamMap.get('secData');
        console.log('resolver =>', secData)
        if(secData !== null){
            localStorage.setItem("secData", secData);
            // let loginDetails = atob(secData)
            // let access_token = JSON.parse(loginDetails).access_token;
            return this.userService.userDetail().pipe(
                catchError(error   => {
                  return EMPTY
                }), mergeMap((response:any)=>{
                if(response.code == 200){
                    this.userDetail = response.data;
                    this.userService.storeUserProfile(response.data);   
                  return of(response)
                }
                return EMPTY
              })
              )

      }
      return of(this.userDetail)
  }
}