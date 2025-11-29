import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Sale, SaleRequest } from '../models/sale.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SaleService {
  constructor(private http: HttpClient) {}

  createSale(request: SaleRequest): Observable<Sale> {
    return this.http.post<Sale>(`${environment.apiUrl}/sales`, request);
  }

  getSales(): Observable<Sale[]> {
    return this.http.get<Sale[]>(`${environment.apiUrl}/sales`);
  }

  getSalesByDateRange(startDate: string, endDate: string): Observable<Sale[]> {
    const params = new HttpParams()
      .set('startDate', startDate)
      .set('endDate', endDate);
    return this.http.get<Sale[]>(`${environment.apiUrl}/sales/filter`, { params });
  }

  getSaleById(id: number): Observable<Sale> {
    return this.http.get<Sale>(`${environment.apiUrl}/sales/${id}`);
  }
}

