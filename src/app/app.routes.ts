import { Routes } from '@angular/router';
import { IndexComponent } from './index/index.component';
import { AboutComponent } from './about/about.component';
import { BookComponent } from './book/book.component';
import { MenuComponent } from './menu/menu.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { EditItemComponent } from './menu/edit-item/edit-item.component';
import { AddItemComponent } from './menu/add-item/add-item.component';
import { provideRouter } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { TableListComponent } from './book/table-list.component';
import { BookingListComponent } from './book/booking-list.component';

export const routes: Routes = [
  { path: '', component: IndexComponent, title: 'Home' },
  { path: 'menu', component: MenuComponent, title: 'Menu' },
  { path: 'about', component: AboutComponent, title: 'About' },
  { path: 'book', component: BookComponent, title: 'Book Table' },
  { path: 'login', component: LoginComponent, title: 'Login' },
  { path: 'logout', component: LoginComponent, title: 'Logout' },
  { path: 'register', component: RegisterComponent, title: 'Register' },
  { path: 'admin-menu/add', component: AddItemComponent, title: 'Add Menu Item' },
  { path: 'admin-menu/edit/:id', component: EditItemComponent, title: 'Edit Menu Item' },
  { path: 'edit/:id', component: EditItemComponent },
  { path: 'book-list', component: BookingListComponent, title: 'Book List' },
  { path: 'table-list', component: TableListComponent, title: 'Table List' },
  { path: 'book-list', component: BookingListComponent, title: 'Book List' },
  { path: '**', redirectTo: '' }
];

export const appRouting = provideRouter(routes);
