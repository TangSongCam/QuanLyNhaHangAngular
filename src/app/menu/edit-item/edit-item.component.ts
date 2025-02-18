import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService, MenuItem } from '../../services/api.service';

@Component({
  selector: 'app-edit-item',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './edit-item.component.html',
  styleUrls: ['./edit-item.component.css']
})
export class EditItemComponent implements OnInit {
  // Khởi tạo item với các trường bắt buộc
  item: MenuItem = {
    name: '',
    description: '',
    price: 0,
    imagePath: '',
    category: ''
  };

  selectedFile: File | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private apiService: ApiService
  ) {}

  ngOnInit(): void {
    // Lấy ID món ăn từ URL và gọi API để lấy thông tin món ăn cần sửa
    const id = this.route.snapshot.params['id'];
    this.apiService.getMenuItemById(id).subscribe(
      (data: MenuItem) => {
        this.item = data;
      },
      (error) => {
        console.error('Lỗi khi lấy thông tin món ăn:', error);
      }
    );
  }

  onFileSelected(event: any): void {
    if (event.target.files && event.target.files.length > 0) {
      this.selectedFile = event.target.files[0];
      console.log('File được chọn:', this.selectedFile);
    }
  }

  onSubmit(): void {
    // Tạo đối tượng FormData và đính kèm các trường dữ liệu
    const formData = new FormData();
    formData.append('name', this.item.name);
    formData.append('description', this.item.description);
    formData.append('price', this.item.price.toString());
    formData.append('category', this.item.category);

    // Nếu người dùng chọn file mới, đính kèm file vào formData
    if (this.selectedFile) {
      formData.append('file', this.selectedFile, this.selectedFile.name);
    }

    // Gọi API cập nhật món ăn. Đảm bảo ApiService có phương thức updateMenuItem nhận (id, formData)
    this.apiService.updateMenuItem(this.item.id!, formData).subscribe(
      (response: MenuItem) => {
        console.log('Món ăn đã được cập nhật:', response);
        alert('Cập nhật món ăn thành công!');
        this.router.navigate(['/menu']);
      },
      (error) => {
        console.error('Lỗi khi cập nhật món ăn:', error);
        alert('Có lỗi xảy ra khi cập nhật món ăn!');
      }
    );
  }
}
