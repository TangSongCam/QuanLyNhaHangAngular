import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BookingService {
  private apiUrl = 'http://localhost:5168/api/Bookings';

  constructor(private http: HttpClient) {}

  // Lấy danh sách đặt bàn
  getBookings(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  // Thêm đặt bàn mới
  addBooking(booking: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, booking);
  }

  // Sửa đặt bàn
  updateBooking(booking: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${booking.id}`, booking);
  }

  // Xóa đặt bàn
  deleteBooking(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }
}
