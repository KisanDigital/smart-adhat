import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Purchase, PurchaseRequest } from '../models/purchase.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PurchaseService {
  constructor(private http: HttpClient) {}

  createPurchase(request: PurchaseRequest): Observable<Purchase> {
    return this.http.post<Purchase>(`${environment.apiUrl}/purchases`, request);
  }

  getPurchases(): Observable<Purchase[]> {
    return this.http.get<Purchase[]>(`${environment.apiUrl}/purchases`);
  }

  getPurchasesByDateRange(startDate: string, endDate: string): Observable<Purchase[]> {
    const params = new HttpParams()
      .set('startDate', startDate)
      .set('endDate', endDate);
    return this.http.get<Purchase[]>(`${environment.apiUrl}/purchases/filter`, { params });
  }

  getPurchaseById(id: number): Observable<Purchase> {
    return this.http.get<Purchase>(`${environment.apiUrl}/purchases/${id}`);
  }
}

