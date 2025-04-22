import { Component, ElementRef, inject, ViewChild } from '@angular/core';
import { ProductsService } from '../../core/services/products/products.service';
import { Subscription } from 'rxjs';
import { IProduct } from '../../shared/interfaces/iproduct';
import { CartService } from '../../core/services/cart/cart.service';
import { RouterLink } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { WishlistService } from '../../core/services/wishlist/wishlist.service';
import { IWishlist } from '../../shared/interfaces/iwishlist';
import { CurrencyPipe } from '@angular/common';
import { SearchPipe } from '../../shared/pipes/search/search.pipe';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-products',
  imports: [RouterLink , CurrencyPipe , SearchPipe , FormsModule],
  templateUrl: './products.component.html',
  styleUrl: './products.component.scss'
})
export class ProductsComponent {
 private readonly productsService = inject(ProductsService);
  private readonly cartService = inject(CartService);
  private readonly toastr = inject(ToastrService);
  private readonly wishlistService = inject(WishlistService)
  
 text : string = "";
 productSubscribe :Subscription = new Subscription();
 cartSubscribe :Subscription = new Subscription();
 wishlistSubscribe : Subscription = new Subscription();
 products:IProduct[] =[];
 isLoading:boolean = false;
 isActive: boolean = false;
 wishlist : IWishlist [] = [];

 ngOnInit(): void {
  this.getProductsData();
}
getProductsData():void{
  this.productSubscribe = this.productsService.getAllProducts().subscribe({
    next:(res)=>{  
      this.products = res.data;
    },
    error:(err)=>{
      console.log(err);
    }
   })
 }

 @ViewChild('myElement') ele !: ElementRef;
 iconColor():void{
  this.ele.nativeElement.classList.remove('text-gray-400');
  this.ele.nativeElement.classList.add('text-red-600');
 }

 addToCart(id:string):void{
  this.isLoading = true;
  this.cartSubscribe = this.cartService.addProductToCard(id).subscribe({
   next:(res)=>{
     this.isLoading = false;
     this.toastr.success(res.message, 'Hi!');
   },
   error:(err)=>{
     console.log(err);
   }
 })
}

addToWislist(id:string):void{
  this.iconColor();
  this.wishlistSubscribe = this.wishlistService.addProductToWishlist(id).subscribe({
   next:(res)=>{
     this.toastr.success(res.message, 'Hi!');
   },
   error:(err)=>{
     console.log(err);
   }
 })
}

 ngOnDestroy(): void {
  this.productSubscribe.unsubscribe();
  this.cartSubscribe.unsubscribe();
  this.wishlistSubscribe.unsubscribe();
}


}
