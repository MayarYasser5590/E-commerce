import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CarouselModule, OwlOptions } from 'ngx-owl-carousel-o';
import { Subscription } from 'rxjs';
import { CartService } from '../../core/services/cart/cart.service';
import { CategoriesService } from '../../core/services/categories/categories.service';
import { ProductsService } from '../../core/services/products/products.service';
import { ICategory } from '../../shared/interfaces/icategory';
import { IProduct } from '../../shared/interfaces/iproduct';
import { ToastrService } from 'ngx-toastr';
import { CurrencyPipe, SlicePipe } from '@angular/common';
import { TermtextPipe } from '../../shared/pipes/termtext/termtext.pipe';


@Component({
  selector: 'app-home',
  imports: [CarouselModule , RouterLink , CurrencyPipe , TermtextPipe],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit , OnDestroy {
 private readonly productsService = inject(ProductsService);
 private readonly categoriesService = inject(CategoriesService);
 private readonly cartService = inject(CartService);
 private readonly toastr = inject(ToastrService);

 customOptions: OwlOptions = {
  loop: true,
  mouseDrag: true,
  touchDrag: true,
  pullDrag: false,
  dots: true,
  autoplay:true,
  autoplayTimeout:2000,
  autoplayHoverPause:true,
  navSpeed: 700,
  navText: ['', ''],
  responsive: {
    0: {
      items: 1
    },
    400: {
      items: 2
    },
    740: {
      items: 3
    },
    940: {
      items: 6
    }
  },
  nav: false
}

customMainSlider: OwlOptions = {
  loop: true,
  mouseDrag: true,
  touchDrag: true,
  pullDrag: false,
  autoplay:true,
  autoplayTimeout:3000,
  autoplayHoverPause:true,
  dots: false,
  navSpeed: 700,
  navText: ['', ''],
 items:1,
  nav: false
}

 products:IProduct[] =[];
 categories:ICategory[]=[];
 categorySubscribe :Subscription = new Subscription();
 productSubscribe :Subscription = new Subscription();
 cartSubscribe :Subscription = new Subscription();
 isLoading:boolean = false;

 ngOnInit(): void {
  this.getProductsData();
  this.getCategoriesData();
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
 getCategoriesData():void{
  this.categorySubscribe = this.categoriesService.getAllCategories().subscribe({
    next:(res)=>{
      this.categories = res.data;
    },
    error:(err)=>{
      console.log(err);
    }
  })
 }
 
 addToCart(id:string):void{
  this.isLoading = true; 
   this.cartSubscribe = this.cartService.addProductToCard(id).subscribe({
    next:(res)=>{
      this.isLoading = false;
      if (res.status === 'success') {
        this.toastr.success(res.message, 'Hi!');
      }
      this.cartService.cartNumber.next(res.numOfCartItems);
    },
    error:(err)=>{
      console.log(err);
    }
  })
 }


 ngOnDestroy(): void {
     this.productSubscribe.unsubscribe();
     this.categorySubscribe.unsubscribe();
     this.cartSubscribe.unsubscribe();
 }

}
