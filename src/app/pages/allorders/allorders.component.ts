import { AfterViewInit, Component, ElementRef, inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from '../../core/services/auth/auth.service';
import { OrdersService } from '../../core/services/orders/orders.service';
import { CartItem, IOrders } from '../../shared/interfaces/iorders';
import { Modal } from 'flowbite';

@Component({
  selector: 'app-allorders',
  imports: [],
  templateUrl: './allorders.component.html',
  styleUrl: './allorders.component.scss'
})
export class AllordersComponent implements OnInit , OnDestroy {
    private readonly ordersService = inject(OrdersService);
    private readonly authService = inject(AuthService);
  
    userOrderSubscribe:Subscription = new Subscription();
    allOrders : IOrders [] = []; 
    cartItems : CartItem [] = [];   
   
    ngOnInit(): void {
      this.getItemId();
    }

     getItemId(){
      this.authService.saveUserData();
      let id = this.authService.userData.id;
      console.log(id);
       this.getUserOrders(id);     
     }

    getUserOrders(id:string):void{
      this.userOrderSubscribe = this.ordersService.getUserOrders(id).subscribe({
        next:(res)=>{
          console.log(res);
          this.allOrders = res;          
        },
        error:(err)=>{
          console.log(err);
        }
      })
    }

    ngOnDestroy(): void {
        this.userOrderSubscribe.unsubscribe();
    }
}
