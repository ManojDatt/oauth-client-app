import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { UserService } from '../user.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {
  constructor( private fb: FormBuilder, private userServie:UserService) { }
  isSubmit: boolean;
  signupForm = this.fb.group({
    username: ['',[Validators.required, Validators.maxLength(100)]],
    email: ['',[Validators.required, Validators.minLength(10), Validators.maxLength(250), Validators.email]],
    password:['',[Validators.required,Validators.minLength(8),Validators.maxLength(100)]],
    confirm_password:['',[Validators.required,Validators.minLength(8), Validators.maxLength(100)]],
  },{validator:[ValidatePassword.MatchPassword]})

  ngOnInit() {
  }

  submitForm(){
    this.isSubmit = true;
    console.log(this.signupForm)
    if(this.signupForm.valid)
    var formdata = {
      username: this.signupForm.get('username').value,
      email: this.signupForm.get('email').value,
      is_active: true,
      password: this.signupForm.get('password').value,
    }
    this.userServie.signupUser(formdata).subscribe((res: any)=>{
      console.log(res)
      alert(res.message)
      Object.keys(this.signupForm.controls).forEach(key => {
        this.signupForm.controls[key].setValue(null)
        this.signupForm.controls[key].setErrors(null)
      })
    })
  }
}


export class ValidatePassword {
	static MatchPassword(abstractControl:AbstractControl){
		let password = abstractControl.get('password').value;
		let confirmPassword = abstractControl.get('confirm_password').value
		if (password !=confirmPassword){
			abstractControl.get('confirm_password').setErrors({
				matchPassword:true
				})
		}else{
			return null
		}
	}
}