import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { BookingService } from './booking.service';

@Component({
  selector: 'app-booking-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './booking-list.component.html',
  styleUrls: ['./book.component.css']
})
export class BookingListComponent implements OnInit {
  bookings: any[] = [];
  newBooking: any = {
    customerName: '',
    phoneNumber: '',
    bookingDate: '',
    numberOfGuests: 1,
    tableId: null,
    notes: '',
  };
  editBooking: any = null;

  // Biến điều khiển hiển thị form
  showAddForm: boolean = true;
  showEditForm: boolean = true;

  constructor(private bookingService: BookingService, private http: HttpClient) {}

  ngOnInit(): void {
    this.getBookings();
  }

  getBookings(): void {
    this.bookingService.getBookings().subscribe(
      (data) => {
        this.bookings = data;
      },
      (error) => {
        console.error('Lỗi khi tải danh sách đặt bàn:', error);
        alert('Lỗi khi tải danh sách đặt bàn!');
      }
    );
  }

  addBooking(): void {
    // Kiểm tra đầu vào cơ bản
    if (!this.newBooking.customerName.trim() || !this.newBooking.phoneNumber.trim()) {
      alert('Vui lòng nhập tên khách hàng và số điện thoại!');
      return;
    }

    this.bookingService.addBooking(this.newBooking).subscribe(
      (booking) => {
        this.bookings.push(booking);
        
        this.newBooking = {
          customerName: '',
          phoneNumber: '',
          bookingDate: '',
          numberOfGuests: 1,
          tableId: null,
          notes: '',
        };
        alert('Thêm đặt bàn thành công!');
      },
      (error) => {
        console.error('Lỗi khi thêm đặt bàn:', error);
        alert('Lỗi khi thêm đặt bàn!');
      }
    );
  }

  edit(booking: any): void {
    // Sao chép booking cần sửa
    this.editBooking = { ...booking };
    // Mở form sửa
    this.showEditForm = true;
  }

  updateBooking(): void {
    if (!this.editBooking) return;

    this.bookingService.updateBooking(this.editBooking).subscribe(
      () => {
        const index = this.bookings.findIndex((b) => b.id === this.editBooking.id);
        if (index !== -1) {
          // Cập nhật lại mảng bookings với dữ liệu từ editBooking
          this.bookings[index] = { ...this.editBooking };
        }
        alert('Cập nhật đặt bàn thành công!');
        // Đóng form chỉnh sửa
        this.editBooking = null;
      },
      (error) => {
        console.error('Lỗi khi cập nhật đặt bàn:', error);
        alert('Lỗi khi cập nhật đặt bàn!');
      }
    );
  }

  deleteBooking(id: number): void {
    // Xác nhận trước khi xóa
    if (!confirm('Bạn có chắc chắn muốn xóa đặt bàn này không?')) {
      return;
    }

    this.bookingService.deleteBooking(id).subscribe(
      () => {
        this.bookings = this.bookings.filter((b) => b.id !== id);
        alert('Xóa đặt bàn thành công!');
      },
      (error) => {
        console.error('Lỗi khi xóa đặt bàn:', error);
        alert('Lỗi khi xóa đặt bàn!');
      }
    );
  }

  // Hàm toggle cho form Thêm Đặt Bàn
  toggleAddForm(): void {
    this.showAddForm = !this.showAddForm;
  }

  // Hàm toggle cho form Chỉnh Sửa Đặt Bàn
  toggleEditForm(): void {
    this.showEditForm = !this.showEditForm;
  }
}
