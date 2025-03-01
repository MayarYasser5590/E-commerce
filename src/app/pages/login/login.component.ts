import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth/auth.service';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule , RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
isLoading:boolean = false;
  msgError : string = "";
  isSuccess : string = "";

 private readonly authService = inject(AuthService);
 private readonly router = inject(Router);

  loginForm : FormGroup = new FormGroup({
    email : new FormControl(null , [Validators.required , Validators.email]),
    password : new FormControl(null , [Validators.required , Validators.pattern(/^[A-Z]\w{7,}$/)]),
  });

  submitForm():void{
    if (this.loginForm.valid) {
      this.isLoading = true;
      this.authService.sendLoginForm(this.loginForm.value).subscribe({
        next:(res)=>{
           this.isLoading = false;
           if (res.message === 'success') {
            window.setTimeout(() => {
              this.router.navigate(['/home']);
          }, 1000);
            
            localStorage.setItem('userToken' , res.token);
            this.authService.saveUserData();
            this.isSuccess = res.message;
           }
        },
        error:(err:HttpErrorResponse)=>{
          this.isLoading = false;
          this.msgError = err.error.message;
       }
      })
    }
  };

}
