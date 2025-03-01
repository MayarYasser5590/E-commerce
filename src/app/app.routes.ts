import { Routes } from '@angular/router';
import { AuthLayoutComponent } from './layouts/auth-layout/auth-layout.component';
import { BlankLayoutComponent } from './layouts/blank-layout/blank-layout.component';
import { NotfoundComponent } from './pages/notfound/notfound.component';
import { authGuard } from './core/guards/auth.guard';
import { logedGuard } from './core/guards/loged.guard';

export const routes: Routes = [
    {path:'',component:AuthLayoutComponent , canActivate:[logedGuard] ,children:[
        {path:'' , redirectTo:'home' , pathMatch:'full'},
        {path:'login',loadComponent:()=> import("./pages/login/login.component").then((c)=>c.LoginComponent),title:'login'},
        {path:'register',loadComponent:()=> import("././pages/register/register.component").then((c)=>c.RegisterComponent) , title:'register'},
        {path:'forgot',loadComponent:()=> import("././pages/forgot-password/forgot-password.component").then((c)=>c.ForgotPasswordComponent) , title:'reset password'}

    ]},
    {path:'',component:BlankLayoutComponent , canActivate:[authGuard] , children:[
        {path:'home',loadComponent:()=> import("./pages/home/home.component").then((c)=>c.HomeComponent) , title:'Home'},
        {path:'cart',loadComponent:()=> import("./pages/cart/cart.component").then((c)=>c.CartComponent) , title:'Cart'},
        {path:'products',loadComponent:()=> import("./pages/products/products.component").then((c)=>c.ProductsComponent) , title:'Products'},
        {path:'brands',loadComponent:()=> import("./pages/brands/brands.component").then((c)=>c.BrandsComponent) , title:'Brands'},
        {path:'categories',loadComponent:()=> import("./pages/categories/categories.component").then((c)=>c.CategoriesComponent) , title:'Categories'},
        {path:'checkout',loadComponent:()=> import("./pages/checkout/checkout.component").then((c)=>c.CheckoutComponent) , title:'Checkout'},
        {path:'details/:id',loadComponent:()=> import("./pages/details/details.component").then((c)=>c.DetailsComponent) , title:'Details'},
        {path:'allorders',loadComponent:()=> import("./pages/allorders/allorders.component").then((c)=>c.AllordersComponent) , title:'All Orders'},
        {path:'wishlist',loadComponent:()=> import("./pages/wishlist/wishlist.component").then((c)=>c.WishlistComponent) , title:'Wishlist'},
        {path:'**', component:NotfoundComponent , title:'Notfound'}
    ]}
];
