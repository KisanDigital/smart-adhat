import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Price, PriceRequest } from '../models/price.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PriceService {
  private apiUrl = `${environment.apiUrl}/prices`;

  constructor(private http: HttpClient) {}

  getMyPrices(): Observable<Price[]> {
    return this.http.get<Price[]>(this.apiUrl);
  }

  getPriceByProduct(productId: number): Observable<Price> {
    return this.http.get<Price>(`${this.apiUrl}/product/${productId}`);
  }

  createOrUpdatePrice(price: PriceRequest): Observable<Price> {
    return this.http.post<Price>(this.apiUrl, price);
  }

  deletePrice(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
