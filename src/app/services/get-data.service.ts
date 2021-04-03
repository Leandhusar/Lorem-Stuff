import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'any'
})
export class GetDataService {
  //In order to change the api url change the url var
  url = "assets/data.json";

  constructor(private http:HttpClient) {}

  public getData(): Observable<any> {
    return this.http.get(this.url);
  }
}
