import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../core/services/auth/auth.service';
import { log } from 'console';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-forgot-password',
  imports: [ReactiveFormsModule],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.scss'
})
export class ForgotPasswordComponent {

  private readonly authService = inject(AuthService);
   private readonly router = inject(Router);

  isLoading:boolean = false;
  step : number = 1;
  msgError : string = "";
  success : number = 0;
  codeError : string ="";
 

  verifyEmailSubscribe:Subscription = new Subscription();
  verifyCodeSubscribe:Subscription = new Subscription();
  resetPasswordSubscribe:Subscription = new Subscription();

  verifyEmail : FormGroup = new FormGroup({
    email : new FormControl(null , [Validators.required , Validators.email])
  })

  verifyCode : FormGroup = new FormGroup({
    resetCode : new FormControl(null , [Validators.required , Validators.pattern(/^[0-9]{6}$/)])
  })

  resetPassword : FormGroup = new FormGroup({
    email : new FormControl(null , [Validators.required , Validators.email]),
    newPassword : new FormControl(null , [Validators.required , Validators.pattern(/^[A-Z]\w{7,}$/)])
  })

  verifyEmailSubmit():void{
    if(this.verifyEmail.valid){
      let emailValue = this.verifyEmail.get('email')?.value;
      this.resetPassword.get('email')?.patchValue(emailValue);
      this.isLoading = true;
   this.verifyEmailSubscribe = this.authService.setEmailVerify(this.verifyEmail.value).subscribe({
        next:(res)=>{
          console.log(res);
          this.isLoading = false;
          if (res.statusMsg === 'success') {
            window.setTimeout(() => {
              this.step = 2;
          }, 100);
          }
        
        },
        error:(err:HttpErrorResponse)=>{
          this.isLoading = false;
          console.log(err);
        }
      })

    }
  }
  verifyCodeSubmit():void{
    if(this.verifyCode.valid){
      this.isLoading = true;
    this.verifyCodeSubscribe = this.authService.setCodeVerify(this.verifyCode.value).subscribe({
        next:(res)=>{
          console.log(res);
          this.isLoading = false;
          if (res.status === 'Success') {
            window.setTimeout(() => {
              this.step = 3;
          }, 100);
          }
        },
        error:(err)=>{
          this.isLoading = false;
          console.log(err);
          this.codeError = err.message;
        }
      })

    }
  }

  resetPasswordSubmit():void{
    if(this.resetPassword.valid){
      this.isLoading = true;
    this.resetPasswordSubscribe = this.authService.setResetPassword(this.resetPassword.value).subscribe({
        next:(res)=>{
          console.log(res);
          this.isLoading = false;
          localStorage.setItem('userToken' , res.token);
        
            window.setTimeout(() => {
              this.router.navigate(['/home']);
          }, 500);
          this.authService.saveUserData();
          this.success = 1;
          
        },
        error:(err)=>{
          this.isLoading = false;
          console.log(err);
          this.msgError = err.message;
        }
      })

    }
  }

 
  ngOnDestroy(): void {
    this.verifyEmailSubscribe.unsubscribe();
    this.verifyCodeSubscribe.unsubscribe();
    this.resetPasswordSubscribe.unsubscribe();
}
}
