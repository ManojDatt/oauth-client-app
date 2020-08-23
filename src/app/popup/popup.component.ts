import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { NgxSmartModalService } from 'ngx-smart-modal';
import { FormBuilder, Validators } from '@angular/forms';
import { UserService } from '../user.service';
declare var $: any;

@Component({
  selector: 'app-popup',
  templateUrl: './popup.component.html',
  styleUrls: ['./popup.component.css']
})
export class PopupComponent implements OnInit {
  @Output() popupEvent = new EventEmitter<any>();
  @Input() popupTitle: string;
  @Input() isLogin:boolean = false;
  @Input() taskDetail: any;
  public users:any=[]
  constructor( private fb: FormBuilder, private userServie:UserService) { }
  isSubmit: boolean;
  submitForm = this.fb.group({
    task_name: ['',[Validators.required, Validators.maxLength(100)]],
    details: ['',[Validators.required, Validators.maxLength(200)]],
    priority: [],
    complete: [false],
    assigned_to: [''],
  })

  ngOnInit() {
    this.taskDetail = {
      complete: false
    };
    if(this.isLogin){
      this.userServie.usersList().subscribe((response:any)=>{
        this.users = response.data;
      })
    }
  }

  onSubmit(){
    if(this.submitForm.valid)
    this.popupEvent.emit(this.submitForm.value)
  }

  refreshSelect(task: any){
    this.taskDetail = task;
    
    Object.keys(this.submitForm.controls).forEach(key => {
      this.submitForm.controls[key].setErrors(null)
    })

    $(()=> {
      $('select').selectpicker('refresh');
  });
  }
}
