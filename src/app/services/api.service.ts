  import { Injectable } from '@angular/core';
  import { HttpClient, HttpErrorResponse } from '@angular/common/http';
  import { Observable, throwError } from 'rxjs';
  import { catchError } from 'rxjs/operators';

  export interface MenuItem {
    id?: number;
    name: string;
    description: string;
    price: number;
    imagePath: string;
    category: string;
    bookingId?: number;
  }

  export interface Booking {
    id?: number;
    customerName: string;
    phoneNumber: string;
    bookingDate: string;
    numberOfGuests: number;
    notes?: string;
  }

  @Injectable({
    providedIn: 'root',
  })
  export class ApiService {
    private baseUrl = 'http://localhost:5168/api';

    constructor(private http: HttpClient) {}

  // Hàm đăng nhập
  login(email: string, password: string): Observable<any> {
    const loginData = { email, password };
    return this.http.post(`${this.baseUrl}/User/login`, loginData).pipe(
      catchError(this.handleError)
    );
  }

    // Lấy tất cả món ăn
    getMenuItems(): Observable<MenuItem[]> {
      return this.http.get<MenuItem[]>(`${this.baseUrl}/menu`).pipe(
        catchError(this.handleError)
      );
    }

    // Lấy danh mục món ăn
    getCategories(): Observable<string[]> {
      return this.http.get<string[]>(`${this.baseUrl}/categories`).pipe(
        catchError(this.handleError)
      );
    }

    // Lọc món ăn theo danh mục
    getMenuItemsByCategory(category: string): Observable<MenuItem[]> {
      return this.http.get<MenuItem[]>(`${this.baseUrl}/menu?category=${category}`).pipe(
        catchError(this.handleError)
      );
    }
    //lấy danh sách bànbàn
    getTables(): Observable<any> {
      return this.http.get(`${this.baseUrl}/Table`).pipe(
        catchError(this.handleError)
      );
    }    
  
    // Đặt bàn
    bookTable(booking: Booking): Observable<Booking> {
      return this.http.post<Booking>(`${this.baseUrl}/bookings`, booking).pipe(
        catchError(this.handleError)
      );
    }

  // Lấy danh sách đặt bàn
  getBookings(): Observable<any> {
    return this.http.get(`${this.baseUrl}/Bookings`);
  }

    // Lấy chi tiết đặt bàn theo ID
    getBookingById(id: number): Observable<Booking> {
      return this.http.get<Booking>(`${this.baseUrl}/Bookings/${id}`).pipe(
        catchError(this.handleError)
      );
    }

      // Cập nhật đặt bàn
      updateTableStatus(tableId: number, status: string): Observable<any> {
        const url = `${this.baseUrl}/Table/${tableId}/status`;
        return this.http.put(url, { status }).pipe(
          catchError(this.handleError)
        );
      }      

        // Xóa đặt bàn
    deleteBooking(id: number): Observable<void> {
      return this.http.delete<void>(`${this.baseUrl}/Bookings/${id}`).pipe(
        catchError(this.handleError)
      );
    }

  // Thêm món ăn
  addMenuItem(formData: FormData): Observable<MenuItem> {
    const url = `${this.baseUrl}/menu?role=Admin`;
    return this.http.post<MenuItem>(url, formData).pipe(
      catchError(this.handleError)
    );
  }

  // lấy món ăn theo ID
  getMenuItemById(id: number): Observable<MenuItem> {
    return this.http.get<MenuItem>(`${this.baseUrl}/menu/${id}`).pipe(
      catchError(this.handleError)
    );
  }


  // Cập nhật món ăn
  updateMenuItem(id: number, formData: FormData): Observable<MenuItem> {
    const url = `${this.baseUrl}/menu/${id}`;
    const headers = { 'Role': 'Admin' };
    return this.http.put<MenuItem>(url, formData, { headers }).pipe(
      catchError(this.handleError)
    );
  }
  

  //xóa món ăn vào ApiService
  deleteMenuItem(id: number, role: string): Observable<void> {
    const url = `${this.baseUrl}/menu/${id}?role=${role}`;
    return this.http.delete<void>(url).pipe(
      catchError(this.handleError)
    );
  }
  
  
    // Xử lý lỗi
    private handleError(error: HttpErrorResponse): Observable<never> {
      console.error('An error occurred:', error);
      const errorMessage = error.error?.message || 
                            `Error ${error.status}: ${error.statusText}`;
      return throwError(() => new Error(errorMessage));
    }
  }
