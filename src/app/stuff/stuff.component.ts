import { ThrowStmt } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import { GetDataService } from "../services/get-data.service";

@Component({
  selector: 'app-stuff',
  templateUrl: './stuff.component.html',
  styleUrls: ['./stuff.component.css']
})
export class StuffComponent implements OnInit {
  categories: any;
  products: any;
  renderCategories: boolean = false;
  renderProducts: boolean = false;

  categoriesCompanion: any = {
    "All Categories": 0,
    "Drinks": 1,
    "Lunch": 2, 
    "Food": 3,
    "Sea": 4
  };

  selectedCategory: string = "All Categories";
  selectedAvailability: number = 0;
  selectedPriceComparison: number = 0;

  filterAppliedStuff: any = [];

  constructor(private getDataService:GetDataService) {
    this.getDataService.getData().subscribe(data => {
      this.categories = data["categories"];
      this.renderCategories = true;
    });

    this.getDataService.getData().subscribe(data => {
      this.products = data["products"];
      this.renderProducts = true;
      this.filterAppliedStuff = this.products;
    });
  }

  ngOnInit(): void {}

  applyFilters(){
    this.filterAppliedStuff = [];
    this.products.forEach(product => {
      if(this.availableOnCategoryFilter(product["categories"]) &&
         this.availableOnPriceFilter(Number(product["price"].replace('.', ''))) &&
         this.availableOnAvailabilityFilter(product)){
        this.filterAppliedStuff.push(product);
      }
    });
  }

  availableOnPriceFilter(product: number): boolean{
    if(this.selectedPriceComparison == 0 ){
      return true;
    }
    if(this.selectedPriceComparison == 1){
      if(product >= 30000){
        return true;
      }
      return false;
    }
    if(this.selectedPriceComparison == 2){
      if(product <= 10000){
        return true;
      }
      return false;
    }
  }

  availableOnCategoryFilter(product: any): boolean{
    if(this.selectedCategory == "All Categories"){
      return true;
    }
    if(product.includes(this.categoriesCompanion[this.selectedCategory])){
      return true;
    }
    return false;
  }

  availableOnAvailabilityFilter(product: any): boolean{
    if(this.selectedAvailability == 0){
      return true;
    }
    if(this.selectedAvailability == 1 && product["available"]){
      return true;
    }
    if(this.selectedAvailability == 2 && product["best_seller"]){
      return true;
    }
    if(this.selectedAvailability == 3 && !product["available"]){
      return true;
    }
    return false;
  }

}
