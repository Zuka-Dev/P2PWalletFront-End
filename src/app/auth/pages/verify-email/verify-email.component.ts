import { Component } from '@angular/core';
import { UserService } from '../../../core/services/user.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-verify-email',
  templateUrl: './verify-email.component.html',
  styleUrl: './verify-email.component.scss',
})
export class VerifyEmailComponent {
  isVerified!: boolean;
  constructor(
    private userService: UserService,
    private route: ActivatedRoute
  ) {}
  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      const token = params['token'];
      const email = params['email'];
      if (token && email) {
        this.verifyEmail(token, email);
      }
    });
  }
  verifyEmail(token: string, email: string): void {
    const data = {
      email: email,
      token: token,
    };
    this.userService.verifyEmail(data).subscribe((response: any) => {
      console.log(response);
      if (response.status) {
        this.isVerified = true;
      } else {
        this.isVerified = false;
      }
    });
  }
}
