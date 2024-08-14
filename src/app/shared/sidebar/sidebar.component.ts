import { Component, Input } from '@angular/core';
import { UserService } from '../../core/services/user.service';
import { Router } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
})
export class SidebarComponent {
  username!: string;
  avatarSrc!: any;
  // @Input() username: string = '';
  // @Input() src!: string;
  constructor(private userService: UserService, private router: Router, private sanitizer: DomSanitizer) {}
  ngOnInit(): void {
    this.getData();
  }
  getData(): void {
    this.userService.getUserDetails().subscribe((data) => {
      console.log('sidebar', data);
      this.username = data.data.username;
       if (data.data.imageBase64) {
         // Sanitize the base64 image string
         this.avatarSrc = this.sanitizer.bypassSecurityTrustUrl(
           `data:image/png;base64,${data.data.imageBase64}`
         );
       } else {
         // Fall back to RoboHash if no avatar is available
         this.avatarSrc = `https://robohash.org/${this.username}`;
       }
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
