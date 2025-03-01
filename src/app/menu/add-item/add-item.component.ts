import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-add-item',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './add-item.component.html',
  styleUrls: ['./add-item.component.css'],
})
export class AddItemComponent {
  newItem = {
    name: '',
    description: '',
    price: 0,
    category: '',
  };

  selectedFile: File | null = null;

  constructor(private apiService: ApiService, private router: Router) {}

  onFileSelected(event: any): void {
    if (event.target.files && event.target.files.length > 0) {
      this.selectedFile = event.target.files[0];
      console.log('Selected file:', this.selectedFile);
    }
  }

  onSubmit(): void {
    const formData = new FormData();
    formData.append('name', this.newItem.name);
    formData.append('description', this.newItem.description);
    formData.append('price', this.newItem.price.toString());
    formData.append('category', this.newItem.category);

    if (this.selectedFile) {
      formData.append('file', this.selectedFile, this.selectedFile.name);
    }

    this.apiService.addMenuItem(formData).subscribe(
      (response) => {
        console.log('Response from API:', response);
        alert('Thêm món ăn thành công!');
        this.router.navigate(['/menu']);
      },
      (error) => {
        console.error('Error while adding item:', error);
        alert('Có lỗi xảy ra khi thêm món ăn!');
      }
    );
  }
}
