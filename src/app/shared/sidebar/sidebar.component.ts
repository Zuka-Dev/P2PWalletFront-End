import { Component, Input } from '@angular/core';
import { UserService } from '../../core/services/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
})
export class SidebarComponent {
  username!: string;
  // @Input() username: string = '';
  // @Input() src!: string;
  constructor(private userService: UserService, private router: Router) {}
  ngOnInit(): void {
    this.getData();
  }
  getData(): void {
    this.userService.getUserDetails().subscribe((data) => {
      console.log('sidebar', data);
      this.username = data.data.username;
    });
  }
  logout(): void {
    this.userService.logout();
    this.router.navigateByUrl('/auth/sign-in');
  }
  profile(): void {
    this.router.navigateByUrl('/profile');
  }
  accounts(): void {
    this.router.navigateByUrl('/accounts');
  }
  dashboard(): void {
    this.router.navigateByUrl('/dashboard');
  }
}
