import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../../../core/services/user.service';
import { BaseResponseDTO } from '../../../../types';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss'],
})
export class SignInComponent {
  isLoading: boolean = false;
  showToast: boolean = false;
  toastMessage: string = '';
  toastType!: 'success' | 'info' | 'error';

  signinForm!: FormGroup;
  type: string = 'password';

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.showToastMessage('User must Verify Email before Signing in', 'info');
    this.signinForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  signin(): void {
    this.isLoading = true;
    if (this.signinForm.invalid) {
      this.showToastMessage('Invalid details entered', 'error');
      this.isLoading = false;
      return;
    }

    console.log(this.signinForm.value);

    this.userService.loginRequest(this.signinForm.value).subscribe(
      (response: BaseResponseDTO | any) => {
        this.isLoading = false;
        console.log(response);

        if (!response.status) {
          this.signinForm.reset();
          console.log(response);
          this.showToastMessage(response.statusMessage, 'error');
        } else {
          this.showToastMessage(response.statusMessage, 'success');
          this.userService.storeToken(response.data.jwtToken);
          this.router.navigateByUrl('/dashboard');
        }
      },
      (error) => {
        this.isLoading = false;
        console.log(error);
        console.error('error: ', error.error.statusMessage);
        this.signinForm.reset();
        this.showToastMessage(error.error.statusMessage, 'error');
      }
    );
  }

  showToastMessage(message: string, type: 'success' | 'info' | 'error'): void {
    this.toastMessage = message;
    this.toastType = type;
    this.showToast = true;
    setTimeout(() => {
      this.showToast = false;
    }, 5000);
  }
}
