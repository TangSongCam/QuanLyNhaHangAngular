import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { TableService } from './TableService';

@Component({
  selector: 'app-table-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './table-list.component.html',
  styleUrls: ['./book.component.css']  // Nếu bạn có file CSS riêng
})
export class TableListComponent implements OnInit {
  tables: any[] = [];
  // Mẫu thêm bàn có thêm thuộc tính "Name"
  newTable: any = { id: 0, name: '', status: 'Available' };
  editTable: any = null;

  // Biến điều khiển hiển thị form Thêm và Sửa
  showAddForm: boolean = true;
  showEditForm: boolean = true;

  constructor(private tableService: TableService, private http: HttpClient) {}

  ngOnInit(): void {
    this.getTables();
  }

  getTables(): void {
    this.tableService.getTables().subscribe(
      (data) => {
        this.tables = data;
      },
      (error) => {
        console.error('Lỗi khi tải danh sách bàn:', error);
        alert('Lỗi khi tải danh sách bàn!');
      }
    );
  }

  addTable(): void {
    if (!this.newTable.name.trim() || !this.newTable.status.trim()) {
      alert('Vui lòng nhập đầy đủ tên bàn và trạng thái!');
      return;
    }

    this.tableService.addTable(this.newTable).subscribe(
      (table) => {
        this.tables.push(table);
        // Reset form thêm bàn
        this.newTable = { id: 0, name: '', status: 'Available' };
        alert('Thêm bàn thành công!');
      },
      (error) => {
        console.error('Lỗi khi thêm bàn:', error);
        alert('Lỗi khi thêm bàn!');
      }
    );
  }

  edit(table: any): void {
    // Sao chép dữ liệu bàn cần sửa để không làm thay đổi trực tiếp trong danh sách
    this.editTable = { ...table };
    this.showEditForm = true;
  }

  updateTable(): void {
    if (!this.editTable) return;

    this.tableService.updateTable(this.editTable).subscribe(
      (updatedTable) => {
        const index = this.tables.findIndex((t) => t.id === updatedTable.id);
        if (index !== -1) {
          this.tables[index] = updatedTable;
        }
        this.editTable = null;
        alert('Cập nhật bàn thành công!');
      },
      (error) => {
        console.error('Lỗi khi cập nhật bàn:', error);
        alert('Lỗi khi cập nhật bàn!');
      }
    );
  }

  deleteTable(id: number): void {
    if (!confirm('Bạn có chắc chắn muốn xóa bàn này không?')) {
      return;
    }

    this.tableService.deleteTable(id).subscribe(
      () => {
        this.tables = this.tables.filter((t) => t.id !== id);
        alert('Xóa bàn thành công!');
      },
      (error) => {
        console.error('Lỗi khi xóa bàn:', error);
        alert('Lỗi khi xóa bàn!');
      }
    );
  }

  // Hàm toggle cho form Thêm Bàn
  toggleAddForm(): void {
    this.showAddForm = !this.showAddForm;
  }

  // Hàm toggle cho form Sửa Bàn
  toggleEditForm(): void {
    this.showEditForm = !this.showEditForm;
  }
}
