import { Component, inject } from '@angular/core';
import { Subscription } from 'rxjs';
import { WishlistService } from '../../core/services/wishlist/wishlist.service';
import { IWishlist } from '../../shared/interfaces/iwishlist';

@Component({
  selector: 'app-wishlist',
  imports: [],
  templateUrl: './wishlist.component.html',
  styleUrl: './wishlist.component.scss'
})
export class WishlistComponent {
 private readonly wishlistService = inject(WishlistService);
     
 wishlist : IWishlist[] = [];


     isLoading:boolean = false;
    removeItemSubscribe:Subscription = new Subscription();
    wishlistSubscribe : Subscription = new Subscription();

  ngOnInit(): void {
     this.getWishlistData(); 
  }

  getWishlistData():void{
   this.wishlistSubscribe = this.wishlistService.getLoggedUserWishlist().subscribe({
     next:(res)=>{
         console.log(res.data);
         console.log("hi");
         
         this.wishlist = res.data;
     },
     error:(err)=>{
      console.log(err);
      
  }
   })
  }

  removeItem(id : string):void{
    this.removeItemSubscribe = this.wishlistService.removeSpecificWishlistItem(id).subscribe({
    next:(res)=>{
      console.log(res);
      this.getWishlistData();
    },
    error:(err)=>{
      console.log(err);
    }
   })
  }


 

  ngOnDestroy(): void {
    this.removeItemSubscribe.unsubscribe();
    this.wishlistSubscribe.unsubscribe();
  }
}
