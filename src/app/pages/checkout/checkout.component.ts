import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { OrdersService } from '../../core/services/orders/orders.service';

@Component({
  selector: 'app-checkout',
  imports: [ReactiveFormsModule , RouterLink],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.scss'
})
export class CheckoutComponent implements OnInit , OnDestroy{

  private readonly ordersService = inject(OrdersService)

  isSuccess : string = "";
  isLoading:boolean = false;
  checkOutForm !: FormGroup;
  cartId : string = localStorage.getItem("cartId") ! ;
  cashPaymentSubscribe:Subscription = new Subscription();
  onlinePaymentSubscribe:Subscription = new Subscription();
  

  ngOnInit(): void {
      this.initForm();
  }

  initForm():void{
    this.checkOutForm = new FormGroup({
      details : new FormControl (null , [Validators.required]),
      phone : new FormControl(null , [Validators.required , Validators.pattern(/^01[0125][0-9]{8}$/)]),
      city : new FormControl (null , [Validators.required])
    })
  }
 
  SubmitForm():void{
    console.log(this.checkOutForm.value);
    console.log( localStorage.getItem("cartId") );
  }
  cashPayment():void{
   this.cashPaymentSubscribe = this.ordersService.cashOrder(this.cartId , this.checkOutForm.value).subscribe({
    next:(res)=>{
      console.log(res);
  },
  error:(err)=>{
   console.log(err);
   
}
    })
  }

  onlinePayment():void{
  this.onlinePaymentSubscribe = this.ordersService.checkSession(this.cartId , this.checkOutForm.value).subscribe({
    next:(res)=>{
      console.log(res.session.url);
      if(res.status === 'success'){
        open(res.session.url , '_self');
      }
  },
  error:(err)=>{
   console.log(err);
   
}
   })
  }

  ngOnDestroy(): void {
      this.cashPaymentSubscribe.unsubscribe();
      this.onlinePaymentSubscribe.unsubscribe();
  }
 
}
