import { Component, inject, input, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../core/services/auth/auth.service';
import { CartService } from '../../core/services/cart/cart.service';
import { log } from 'console';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink , RouterLinkActive],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent implements OnInit{
  isLogin = input <boolean> (true);
   readonly authService = inject(AuthService);
   readonly cartService = inject(CartService);

   countNumber : number = 0;

   ngOnInit(): void {
       this.cartService.getLoggedUserCart().subscribe({
        next : (res)=>{
          this.cartService.cartNumber.next(res.numOfCartItems);
        }
       })
       
       this.cartService.cartNumber.subscribe({
        next : (data)=>{
          this.countNumber = data;
        }
       })
   }

}
