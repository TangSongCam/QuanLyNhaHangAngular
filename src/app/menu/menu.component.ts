import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { ApiService, MenuItem } from '../services/api.service';
import { AuthService } from '../services/auth.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    HttpClientModule,
    FormsModule,
  ],
  providers: [ApiService],
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css'],
})
export class MenuComponent implements OnInit {
  menuItems: MenuItem[] = [];
  filteredMenuItems: MenuItem[] = [];
  categories: string[] = [];
  selectedCategory: string = 'All';
  userName: string | null = '';
  searchTerm: string = '';
  userRole: string | null = '';

  backendUrl: string = 'http://localhost:5168/';

  constructor(
    private apiService: ApiService, 
    private authService: AuthService, 
  ) {}

  ngOnInit(): void {
    this.userName = this.authService.getUserName();
    this.userRole = this.authService.getRole();

    // Lấy danh sách món ăn từ API
    this.apiService.getMenuItems().subscribe(
      (data: MenuItem[]) => {
        this.menuItems = data;
        this.filteredMenuItems = data;
        this.categories = ['All', ...new Set(data.map(item => item.category.trim()))];
      },
      (error) => {
        console.error('Lỗi khi lấy dữ liệu menu:', error);
      }
    );
  }

  filterMenu(category: string): void {
    this.selectedCategory = category;
    this.filteredMenuItems = category === 'All'
      ? this.menuItems
      : this.menuItems.filter(item => item.category === category);
  }

  searchMenu(): void {
    const lowerCaseSearchTerm = this.searchTerm.toLowerCase();
    this.filteredMenuItems = this.menuItems.filter(
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
  }

  deleteItem(item: MenuItem): void {
    if (this.userRole !== 'Admin') {
      alert('Bạn không có quyền xóa món ăn này.');
      return;
    }

    if (confirm('Bạn có chắc chắn muốn xóa món ăn này?')) {
      this.apiService.deleteMenuItem(item.id!, this.userRole).subscribe(
        () => {
          alert('Xóa món ăn thành công!');
          this.menuItems = this.menuItems.filter(m => m.id !== item.id);
          this.filteredMenuItems = this.filteredMenuItems.filter(m => m.id !== item.id);
        },
        (error) => {
          console.error('Lỗi khi xóa món ăn:', error);
          alert('Xóa món ăn thất bại. Vui lòng thử lại.');
        }
      );
    }
  }


  getImageUrl(item: MenuItem): string {
    return item.imagePath
      ? this.backendUrl + item.imagePath.replace(/\\/g, '/')
      : 'assets/images/default-food.jpg';
  }
}
