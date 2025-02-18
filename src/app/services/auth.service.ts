import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://localhost:5168/api/User';

  constructor(private http: HttpClient) {}

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
    if (typeof window !== 'undefined') {
      localStorage.setItem('userName', userName);
    }
  }

  // Lấy tên người dùng từ localStorage
  getUserName(): string | null {
    if (typeof window !== 'undefined') {
      const userName = localStorage.getItem('userName');
      return userName ? userName : null;
    }
    return null;
  }

  // Lưu vai trò người dùng (nếu cần)
  setRole(role: string): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem('role', role);
    }
  }

  // Lấy vai trò người dùng từ localStorage
  getRole(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('role');
    }
    return null;
  }

  // Đăng xuất: xóa thông tin khỏi localStorage
  logout(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('role');
      localStorage.removeItem('userName');
    }
  }
}
