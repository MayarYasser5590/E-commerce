import { Component, inject } from '@angular/core';
import { ICategory } from '../../shared/interfaces/icategory';
import { Subscription } from 'rxjs';
import { CategoriesService } from '../../core/services/categories/categories.service';

@Component({
  selector: 'app-categories',
  imports: [],
  templateUrl: './categories.component.html',
  styleUrl: './categories.component.scss'
})
export class CategoriesComponent {
 private readonly categoriesService = inject(CategoriesService);

categories:ICategory[]=[];
 categorySubscribe :Subscription = new Subscription();


 ngOnInit(): void {
  this.getCategoriesData();
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
 
ngOnDestroy(): void {
     this.categorySubscribe.unsubscribe();
 }
}
