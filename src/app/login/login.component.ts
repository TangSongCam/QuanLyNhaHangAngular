import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, RouterModule],
  providers: [AuthService],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  email: string = '';
  password: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  login(): void {
    const credentials = { email: this.email, password: this.password };
    this.authService.login(credentials).subscribe(
      (response: any) => {
        localStorage.setItem('userName', response.userName);
        this.authService.setRole(response.role);

        alert('Đăng nhập thành công!');
        this.router.navigate(['/menu']);
      },
      (error) => {
        alert('Đăng nhập thất bại! Vui lòng kiểm tra email và mật khẩu.');
        console.error('Lỗi đăng nhập:', error);
      }
    );
  }
}
