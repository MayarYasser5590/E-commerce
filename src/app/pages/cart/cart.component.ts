import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { Subscription } from 'rxjs';
import { CartService } from '../../core/services/cart/cart.service';
import { ICart } from '../../shared/interfaces/icart';
import { CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-cart',
  imports: [RouterLink , RouterLinkActive , CurrencyPipe],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.scss'
})
export class CartComponent implements OnInit , OnDestroy {

  private readonly cartService = inject(CartService);

    cartDetails : ICart = {} as ICart;
    isLoading:boolean = false;
    cartSubscribe:Subscription = new Subscription();
    removeItemSubscribe:Subscription = new Subscription();
    updateItemSubscribe:Subscription = new Subscription();
    removeItemId : string = "";

  ngOnInit(): void {
     this.getCartData(); 
  }

  getCartData():void{
   this.cartSubscribe = this.cartService.getLoggedUserCart().subscribe({
     next:(res)=>{
         console.log(res.data);
         this.cartDetails = res.data;
     },
     error:(err)=>{
      console.log(err);
      
  }
   })
  }

  removeItem(id : string):void{
    this.removeItemId = id;
    this.isLoading = true;
    this.removeItemSubscribe = this.cartService.removeSpecificCartItem(id).subscribe({
    next:(res)=>{
      this.cartDetails = res.data;
      this.isLoading = false;
      this.cartService.cartNumber.next(res.numOfCartItems);
    },
    error:(err)=>{
      console.log(err);
      this.isLoading = false;
    }
   })
  }

  updateCount(id: string , count: number):void{
    this.updateItemSubscribe = this.cartService.updateCartProductQuantity(id , count).subscribe({
      next:(res)=>{
        this.cartDetails = res.data;
      },
      error:(err)=>{
        console.log(err);
      }
   })
  }

  cartId():void{
    localStorage.setItem("cartId" , this.cartDetails._id);
  }

  clearItems():void{
    this.isLoading =true;
    this.cartService.clearAllCart().subscribe({
      next:(res)=>{
        this.isLoading = false;
        if(res.message === 'success'){
         this.cartDetails = {} as ICart;
         this.cartService.cartNumber.next(0);
        }
      },
      error:(err)=>{
        console.log(err);
      }
    })
  }

  ngOnDestroy(): void {
    this.cartSubscribe.unsubscribe();  
    this.removeItemSubscribe.unsubscribe();
    this.updateItemSubscribe.unsubscribe();
  }
  
}
