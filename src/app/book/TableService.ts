import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TableService {
  private apiUrl = 'http://localhost:5168/api/Table';

  constructor(private http: HttpClient) {}

  getTables(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  addTable(table: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, table);
  }

  updateTable(table: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${table.id}`, table);
  }

  deleteTable(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
