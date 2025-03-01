import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://localhost:5168/api/User';
  private isBrowser: boolean;

  constructor(private http: HttpClient, @Inject(PLATFORM_ID) private platformId: Object) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  // Phương thức đăng nhập
  login(credentials: { email: string; password: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, credentials);
  }

  // Phương thức đăng ký
  register(user: { username: string; email: string; password: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, user);
  }

  // Lưu tên người dùng vào localStorage
  setUserName(userName: string): void {
    if (this.isBrowser) {
      localStorage.setItem('userName', userName);
    }
  }

  // Lấy tên người dùng từ localStorage
  getUserName(): string | null {
    if (this.isBrowser) {
      return localStorage.getItem('userName');
    }
    return null;
  }

  // Lưu vai trò người dùng
  setRole(role: string): void {
    if (this.isBrowser) {
      localStorage.setItem('role', role);
    }
  }

  // Lấy vai trò người dùng từ localStorage
  getRole(): string | null {
    if (this.isBrowser) {
      return localStorage.getItem('role');
    }
    return null;
  }

  // Đăng xuất
  logout(): void {
    if (this.isBrowser) {
      localStorage.removeItem('role');
      localStorage.removeItem('userName');
    }
  }
}
