import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { BrandsService } from '../../core/services/brands/brands.service';
import { Subscription } from 'rxjs';
import { IBrand } from '../../shared/interfaces/ibrand';

@Component({
  selector: 'app-brands',
  imports: [],
  templateUrl: './brands.component.html',
  styleUrl: './brands.component.scss'
})
export class BrandsComponent implements OnInit , OnDestroy{

   private readonly brandsService = inject(BrandsService);
  
    brandSubscribe :Subscription = new Subscription();
    brands : IBrand[] = [];

    ngOnInit(): void {
      this.getBrandsData();
    
    }
    
    
     getBrandsData():void{
      this.brandSubscribe = this.brandsService.getAllBrands().subscribe({
        next:(res)=>{  
          this.brands = res.data;
        },
        error:(err)=>{
          console.log(err);
        }
      })
     }


     ngOnDestroy(): void {
      this.brandSubscribe.unsubscribe();
     
  }
 

}
