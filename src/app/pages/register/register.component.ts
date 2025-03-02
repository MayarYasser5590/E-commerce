import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth/auth.service';

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule , RouterLink],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {
  
  isLoading:boolean = false;
  msgError : string = "";
  isSuccess : string = "";

 private readonly authService = inject(AuthService);
 private readonly router = inject(Router);

  registerForm : FormGroup = new FormGroup({
    name : new FormControl(null , [Validators.required , Validators.minLength(3) , Validators.maxLength(20)]),
    email : new FormControl(null , [Validators.required , Validators.email]),
    password : new FormControl(null , [Validators.required , Validators.pattern(/^[A-Z]\w{7,}$/)]),
    rePassword : new FormControl(null , [Validators.required]),
    phone : new FormControl(null , [Validators.required , Validators.pattern(/^01[0125][0-9]{8}$/)]),
  } , {validators: this.confirmPassword});

  submitForm():void{
    if (this.registerForm.valid) {
      this.isLoading = true;
      this.authService.sendRegisterForm(this.registerForm.value).subscribe({
        next:(res)=>{
           this.isLoading = false;
           if (res.message === 'success') {
            window.setTimeout(() => {
              this.router.navigate(['/login']);
          }, 1000);
          
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
  confirmPassword(group : AbstractControl){
    const password = group.get('password')?.value;
    const rePassword = group.get('rePassword')?.value;
    return password === rePassword ? null : {mismatch : true}    
}
}
