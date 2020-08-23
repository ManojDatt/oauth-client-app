import { Component, OnInit, ViewChild } from '@angular/core';
import { UserService } from '../user.service';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Observable } from 'rxjs';
import { PopupComponent } from '../popup/popup.component';
declare var $: any;

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  public today: Date = new Date()
  public isLoggedIn: Observable<boolean>;
  public taskList: Array<any>=[];
  public userDetails:any = {};
  public popupTitle: string = ""
  public taskDetail:any = null;
  public selectedAction: string = ''

  @ViewChild(PopupComponent) popupModal:PopupComponent;

  constructor(private router: Router, private userService: UserService, private activatedRoute: ActivatedRoute) {
    window.history.pushState({}, document.title, window.location.pathname);
   }

  ngOnInit() {
    this.isLoggedIn = this.userService.isLoggedIn()
    this.userDetails = this.userService.getUserProfile()
    
    console.log('data =>', this.activatedRoute.snapshot)
    setInterval(() => {
      this.today = new Date();
    }, 1);
    this.isLoggedIn.subscribe((rs)=>{
      if(rs){
        this.allTask()
      }
    })
    
  }

  addTask(){
    this.selectedAction = 'Add'
    this.popupTitle = "Add New Task";
    this.taskDetail = {
            task_name: "",
            details: "",
            priority: "MEDIUM",
            assigned_to: ["2"],
            complete: false
        }
    this.popupModal.submitForm.patchValue(this.taskDetail)
    this.popupModal.refreshSelect(this.taskDetail)
    $("#taskModal").modal('show')
  }

  updateTask(task:any){
    this.selectedAction = 'Update'
    this.popupTitle = "Update Task "+task.task_name;
    this.taskDetail = task;
    this.popupModal.submitForm.patchValue(this.taskDetail)
    this.popupModal.refreshSelect(task)
    $("#taskModal").modal('show')
  }
  deleteTask(task:any){
    this.userService.deleteTask(task.id).subscribe((res:any)=>{
      if(res.code == 200){
        this.allTask()
      }
    })
  }

  allTask(){
    this.userService.taskList().subscribe((response:any)=>{
      if(response.code === 200){
        this.taskList = response.data
      }
    })
  }
  submitForm(form:any){
    if(this.selectedAction == "Add"){
      this.userService.addTask(form).subscribe((response:any)=>{
        if(response.code == 200){
          this.allTask()
          alert(response.message)
          $("#taskModal").modal('hide')
        }else{
          alert(response.error_detail)
        }
      })
    }else{
      this.userService.updateTask(this.taskDetail.id, form).subscribe((response:any)=>{
        if(response.code == 200){
          this.allTask()
          alert(response.message)
          $("#taskModal").modal('hide')
        }else{
          alert(response.error_detail)
        }
      })
    }
    
  }
  
}
