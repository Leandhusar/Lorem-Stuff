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

  selectedSortMethod: number = 0;

  filterAppliedStuff: any = [];

  /**
   * Se utiliza el servicio para leer el archivo de datos para
   * cargar las categorias y los productos. En los productos se crea una variable para guardar todos los productos
   * y un auxiliar filterAppliedFilters para aplicar los cambios sin necesidad de 
   * recuperar los datos del web service si se reinician los filtros.
   */
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

  /**
   * Al momento de aplicar filtros es necesario vaciar los productos a mostrar
   * por cada producto recibido se debe evaluar que cumpla con el filtro de categoria,
   * filtro de precio y filtro de disponibilidad para ser agregado a la lista de productos a mostrar
   */
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

  /**
   * Solo espera el precio del producto. Retorna verdadero dependiendo de si
   * cumple la condicion del filtro selectedPriceComparison seleccionado
   * 0 - Cualquier producto
   * 1 - El producto supera los 30000
   * 2 - El producto es inferior a los 10000
   * De no ser asi retorna falso
   */
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

  /**
   * Recibe una lista de categorias de cada producto
   * Retona verdadero si se seleccionan todas las categorias xor
   * se incluye la categoria de selectedCategory dentro de la lista
   * De no ser asi retorna falso
   */
  availableOnCategoryFilter(product: any): boolean{
    if(this.selectedCategory == "All Categories"){
      return true;
    }
    if(product.includes(this.categoriesCompanion[this.selectedCategory])){
      return true;
    }
    return false;
  }

  /**
   * Se le pasa por parametro un producto de la lista de productos
   * y tiene en cuenta el criterio de seleccion. Esto retorna verdadero si
   * solo en cada uno de estos casos:
   * 0 - Cualquier producto
   * 1 - Producto disponible
   * 2 - Es el mas vendido
   * 3 - No esta disponible
   * Si no cuenta con el criterio seleccionado retorna falso 
   */
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

  /**
   * Lee el parametro de ordenamiento seleccionado en selectedSortMethod
   * Si es 1 ordena por el precio mas alto
   * Si es 2 ordena por el precio mas bajo
   * Si es 3 ordena por el nombre en orden alfabetico
   */
  sortStuff(){
    if(this.selectedSortMethod == 1){
      this.filterAppliedStuff.sort(function(a, b){
        return Number(a["price"].replace('.', '')) - Number(b["price"].replace('.', ''));
      });
    }
    if(this.selectedSortMethod == 2){
      this.filterAppliedStuff.sort(function(a, b){
        return Number(b["price"].replace('.', '')) - Number(a["price"].replace('.', ''));
      });
    }
    if(this.selectedSortMethod == 3){
      this.filterAppliedStuff.sort(function(a, b){
        if(a["name"].toLowerCase() > b["name"].toLowerCase()){
          return 1;
        }
        if(a["name"].toLowerCase() < b["name"].toLowerCase()){
          return -1;
        }
        return 0;
      });
    }
  }

}
