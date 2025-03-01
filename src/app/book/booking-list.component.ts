import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { BookingService } from './booking.service';
import { ApiService } from '../services/api.service';

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
    bookingTime: '',
    numberOfGuests: 1,
    tableId: null,
    notes: ''
  };

  editBooking: any = null;

  showAddForm: boolean = true;
  showEditForm: boolean = true;

  tables: { id: number; name: string; status: string }[] = [];

  constructor(
    private bookingService: BookingService, 
    private http: HttpClient,
    private apiService: ApiService
  ) {}

  ngOnInit(): void {
    this.getBookings();
    this.fetchTables();
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

  fetchTables(): void {
    this.apiService.getTables().subscribe(
      (response: any[]) => {
        this.tables = response.map(table => ({
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

  addBooking(): void {
    if (!this.newBooking.customerName.trim() || !this.newBooking.phoneNumber.trim()) {
      alert('Vui lòng nhập tên khách hàng và số điện thoại!');
      return;
    }

    this.bookingService.addBooking(this.newBooking).subscribe(
      (booking) => {
        const selectedTable = this.tables.find(t => t.id === booking.tableId);
        if (selectedTable) {
          selectedTable.status = 'occupied';
        }
        this.bookings.push(booking);
        this.newBooking = {
          customerName: '',
          phoneNumber: '',
          bookingDate: '',
          bookingTime: '',
          numberOfGuests: 1,
          tableId: null,
          notes: ''
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
    this.editBooking = { ...booking, originalTableId: booking.tableId };
    this.showEditForm = true;
  }

  updateBooking(): void {
    if (!this.editBooking) return;

    const originalTableId = this.editBooking.originalTableId;
    const newTableId = this.editBooking.tableId;

    this.bookingService.updateBooking(this.editBooking).subscribe(
      () => {
        const index = this.bookings.findIndex((b) => b.id === this.editBooking.id);
        if (index !== -1) {
          this.bookings[index] = { ...this.editBooking };
        }
        if (originalTableId !== newTableId) {
          const oldTable = this.tables.find(t => t.id === originalTableId);
          if (oldTable) {
            oldTable.status = 'available';
          }
          const newTable = this.tables.find(t => t.id === newTableId);
          if (newTable) {
            newTable.status = 'occupied';
          }
        }
        alert('Cập nhật đặt bàn thành công!');
        this.editBooking = null;
      },
      (error) => {
        console.error('Lỗi khi cập nhật đặt bàn:', error);
        alert('Lỗi khi cập nhật đặt bàn!');
      }
    );
  }

  deleteBooking(id: number): void {
    if (!confirm('Bạn có chắc chắn muốn xóa đặt bàn này không?')) {
      return;
    }

    console.log('Deleting booking with id:', id);

    this.bookingService.deleteBooking(id).subscribe(
      () => {
        const bookingToDelete = this.bookings.find(b => b.id === id);
        if (bookingToDelete) {
          const table = this.tables.find(t => t.id === bookingToDelete.tableId);
          if (table) {
            table.status = 'available';
          }
        }
        this.bookings = this.bookings.filter((b) => b.id !== id);
        alert('Xóa đặt bàn thành công!');
      },
      (error) => {
        console.error('Lỗi khi xóa đặt bàn:', error);
        alert('Lỗi khi xóa đặt bàn!');
      }
    );
  }

  toggleAddForm(): void {
    this.showAddForm = !this.showAddForm;
  }

  toggleEditForm(): void {
    this.showEditForm = !this.showEditForm;
  }
}
