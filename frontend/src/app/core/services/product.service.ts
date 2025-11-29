import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product, ProductCategory } from '../models/product.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  constructor(private http: HttpClient) {}

  getAllProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(`${environment.apiUrl}/products`);
  }

  getProducts(): Observable<Product[]> {
    return this.getAllProducts();
  }

  getProductById(id: number): Observable<Product> {
    return this.http.get<Product>(`${environment.apiUrl}/products/${id}`);
  }

  getProductsByCategory(category: ProductCategory): Observable<Product[]> {
    return this.http.get<Product[]>(`${environment.apiUrl}/products/category/${category}`);
  }

  createProduct(product: any): Observable<Product> {
    return this.http.post<Product>(`${environment.apiUrl}/products`, product);
  }
}
