import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, RouterModule],
  providers: [AuthService],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent {
  name: string = '';
  email: string = '';
  password: string = '';
  confirmPassword: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  register(): void {
    if (this.password !== this.confirmPassword) {
      alert('Mật khẩu và xác nhận mật khẩu không khớp!');
      return;
    }

    const newUser = { 
      username: this.name,
      email: this.email, 
      password: this.password,
      role: 'User'
    };

    this.authService.register(newUser).subscribe(
      (response) => {
        alert('Đăng ký thành công!');
        this.router.navigate(['/login']);
      },
      (error) => {
        console.error('Lỗi đăng ký:', error);
        if (error.status === 400) {
          alert('Email đã tồn tại hoặc có lỗi trong quá trình đăng ký.');
        } else {
          alert('Đăng ký thất bại! Vui lòng thử lại.');
        }
      }
    );
  }
}
