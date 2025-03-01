import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductsService } from '../../core/services/products/products.service';
import { Subscription } from 'rxjs';
import { IProduct } from '../../shared/interfaces/iproduct';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { CartService } from '../../core/services/cart/cart.service';
import { ICart } from '../../shared/interfaces/icart';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-details',
  imports: [CarouselModule],
  templateUrl: './details.component.html',
  styleUrl: './details.component.scss'
})
export class DetailsComponent implements OnInit , OnDestroy {
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly productsService = inject(ProductsService);
  private readonly cartService = inject(CartService);
  private readonly toastr = inject(ToastrService);

  productSubscribe:Subscription = new Subscription();
  detailsProduct:IProduct | null = null ;
  cartSubscribe :Subscription = new Subscription();
  carts : ICart [] = [];
  isLoading:boolean = false;

  detailsOptions: OwlOptions = {
    loop: true,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: false,
    autoplay:true,
  autoplayTimeout:2000,
  autoplayHoverPause:true,
    dots: true,
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
        items: 4
      }
    },
    nav: false
  }

  ngOnInit(): void {
    this.getDetails();
}

  getDetails():void{
    this.activatedRoute.paramMap.subscribe({
      next:(p)=>{
        let idProduct = p.get('id');   
    this.productSubscribe = this.productsService.getSpecificProducts(idProduct).subscribe({
          next:(res)=>{
            this.detailsProduct = res.data;
            console.log(res.data);
            
          },
          error:(err)=>{
            console.log(err);
            }
        })
      }
    })
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

  ngOnDestroy(): void {
      this.productSubscribe.unsubscribe();
      this.cartSubscribe.unsubscribe();
  }
}
