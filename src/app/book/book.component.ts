import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ApiService } from '../services/api.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-book',
  standalone: true,
  imports: [RouterLink, CommonModule, FormsModule],
  templateUrl: './book.component.html',
  styleUrls: ['./book.component.css'],
})
export class BookComponent implements OnInit {
  userName: string | null = '';
  userRole: string | null = '';
  isAdmin: boolean = false;

  booking = {
    customerName: '',
    phoneNumber: '',
    email: '',
    numberOfGuests: 2,
    bookingDate: '',
    bookingTime: '',
    tableId: 0,
    notes: ''
  };

  tables: { id: number; name: string; status: string }[] = [];

  constructor(private apiService: ApiService, private router: Router, private authService: AuthService) {}

  ngOnInit(): void {
    this.fetchTables();
    this.userName = this.authService.getUserName();
    this.userRole = this.authService.getRole();
    this.isAdmin = this.userRole === 'Admin';
  }

  fetchTables() {
    this.apiService.getTables().subscribe(
      (response: any) => {
        this.tables = response.map((table: any) => ({
          id: table.id,
          name: table.name ? table.name : `Bàn ${table.id}`,
          status: table.status.toLowerCase()
        }));
      },
      (error) => {
        alert('Lỗi khi tải danh sách bàn. Vui lòng thử lại!');
      }
    );
  }

  validateBooking(): boolean {
    if (!this.booking.customerName.trim()) {
      alert('Vui lòng nhập tên khách hàng!');
      return false;
    }
    if (!this.booking.phoneNumber.trim() || !/^\d{10,11}$/.test(this.booking.phoneNumber)) {
      alert('Vui lòng nhập số điện thoại hợp lệ (10-11 số)!');
      return false;
    }
    if (!this.booking.email.trim() || !/\S+@\S+\.\S+/.test(this.booking.email)) {
      alert('Vui lòng nhập địa chỉ email hợp lệ!');
      return false;
    }
    if (!this.booking.tableId) {
      alert('Vui lòng chọn bàn!');
      return false;
    }
    if (!this.booking.bookingDate) {
      alert('Vui lòng chọn ngày đặt bàn!');
      return false;
    }
    if (!this.booking.bookingTime.trim()) {
      alert('Vui lòng chọn thời gian đặt bàn!');
      return false;
    }
    return true;
  }

  onSubmit() {
    if (!this.validateBooking()) {
      return;
    }

    this.apiService.bookTable(this.booking).subscribe(
      (response) => {
        alert('Đặt bàn thành công!');
        this.tables = this.tables.map(table =>
          table.id === this.booking.tableId ? { ...table, status: 'occupied' } : table
        );
        this.resetForm();
      },
      (error) => {
        alert('Đặt bàn thất bại. Vui lòng thử lại sau!');
      }
    );
  }

  resetForm() {
    this.booking = {
      customerName: '',
      phoneNumber: '',
      email: '',
      numberOfGuests: 2,
      bookingDate: '',
      bookingTime: '',
      tableId: 0,
      notes: ''
    };
  }

  logout(): void {
    this.authService.logout();
    this.userName = null;
    this.userRole = null;
    this.isAdmin = false;
    this.router.navigate(['/login']);
  }
}
