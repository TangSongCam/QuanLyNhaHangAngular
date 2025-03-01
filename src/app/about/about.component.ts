import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink, RouterOutlet } from '@angular/router';
import { ApiService } from '../services/api.service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [
    RouterLink,
    CommonModule,
    HttpClientModule,
    FormsModule,
  ],
  providers: [ApiService],
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css']  
})
export class AboutComponent implements OnInit {
  userName: string | null = '';
  
  constructor(
    private apiService: ApiService, 
    private authService: AuthService, 
  ) {}

  ngOnInit(): void {
    this.userName = this.authService.getUserName();
    console.log('Tên người dùng:', this.userName);
  }

  logout(): void {
    this.authService.logout(); 
    this.userName = null;
  }
}
