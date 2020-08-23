import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { UserService } from '../user.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  public isLoggedIn: Observable<boolean>;
  public userDetails:any = {};
  public auth_server_login = environment.apiUrl+'login';
  constructor(private userService: UserService) { }

  ngOnInit() {
    this.isLoggedIn = this.userService.isLoggedIn()
    this.userDetails = this.userService.getUserProfile()
    console.log(' login =>', this.isLoggedIn)
    
  }

  loginRequest(){
    document.location.href = this.auth_server_login;
  }
}
