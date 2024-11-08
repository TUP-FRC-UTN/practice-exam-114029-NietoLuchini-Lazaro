import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Order, Product } from '../models/order';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  constructor(private http:HttpClient) { }


  getOrders():Observable<Order[]>{
    return this.http.get<Order[]>('http://localhost:3000/orders');
  }

  postOrder(form:any):Observable<any>{
    return this.http.post<any>('http://localhost:3000/orders',form);
  }

  getProducts():Observable<Product[]>{
    return this.http.get<Product[]>('http://localhost:3000/products');
  }
  

}
