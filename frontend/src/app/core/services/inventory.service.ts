import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Inventory } from '../models/inventory.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class InventoryService {
  constructor(private http: HttpClient) {}

  getInventory(): Observable<Inventory[]> {
    return this.http.get<Inventory[]>(`${environment.apiUrl}/inventory`);
  }

  getInventoryByProduct(productId: number): Observable<Inventory> {
    return this.http.get<Inventory>(`${environment.apiUrl}/inventory/product/${productId}`);
  }
}

