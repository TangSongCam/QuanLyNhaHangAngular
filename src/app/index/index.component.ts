import { Component, OnInit } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { ApiService, MenuItem } from '../services/api.service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-index',
  standalone: true,
  imports: [
    RouterLink,
    CommonModule,
    HttpClientModule,
    FormsModule,
  ],
  providers: [ApiService],
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.css'],
})
export class IndexComponent implements OnInit {
  menuItems: MenuItem[] = [];
  fileteredMenuItems: MenuItem[] = [];
  categories: string[] = [];
  selectedCategory: string = 'All';
  searchTerm: string = '';
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
  backendUrl: string = 'http://localhost:5168/';

  constructor(
    private apiService: ApiService, 
    private authService: AuthService, 
    private router: Router
  ) {}

  ngOnInit(): void {
    this.fetchTables();
    this.userRole = this.authService.getRole();
    this.isAdmin = this.userRole === 'Admin';
    this.userName = this.authService.getUserName();
    console.log('User Name:', this.userName);

    this.apiService.getMenuItems().subscribe(
      (data: MenuItem[]) => {
        this.menuItems = data;
        this.fileteredMenuItems = data;
        this.categories = ['All', ...new Set(data.map((item) => item.category))];
      },
      (error) => {
        console.error('Lỗi khi lấy dữ liệu menu:', error);
      }
    );
  }

  filermenu(category: string): void {
    this.selectedCategory = category;
    this.updateFilteredMenuItems();
  }

  searchMenu(): void {
    this.updateFilteredMenuItems();
  }

  private updateFilteredMenuItems(): void {
    const lowerCaseSearchTerm = this.searchTerm.toLowerCase();
    this.fileteredMenuItems = this.menuItems.filter(
      (item) =>
        (this.selectedCategory === 'All' || item.category === this.selectedCategory) &&
        (item.name.toLowerCase().includes(lowerCaseSearchTerm) ||
         item.description.toLowerCase().includes(lowerCaseSearchTerm))
    );
  }


  logout(): void {
    this.authService.logout();
    this.userName = null;
    this.userRole = null;
    this.isAdmin = false;
    this.router.navigate(['/login']);
  }

  fetchTables(): void {
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

  onSubmit(): void {
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

  resetForm(): void {
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

  getImageUrl(item: MenuItem): string {
    return item.imagePath
      ? this.backendUrl + item.imagePath.replace(/\\/g, '/')
      : 'assets/images/default-food.jpg';
  }
}
