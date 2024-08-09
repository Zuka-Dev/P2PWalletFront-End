import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../../../core/services/user.service';
import { Router } from '@angular/router';
import { BaseResponseDTO, SignUpDTO } from '../../../../types';

@Component({
  selector: 'app-sign-up',
  standalone: false,
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.scss',
})
export class SignUpComponent {
  signupForm!: FormGroup;
  isLoading: boolean = false;
  showToast: boolean = false;
  toastMessage: string = '';
  toastType!: 'success' | 'info' | 'error';
  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private router: Router
  ) {}
  ngOnInit(): void {
    this.signupForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      username: ['', Validators.required],
      email: ['', Validators.required, Validators.email],
      phoneNumber: ['', Validators.required],
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required],
      address: ['', Validators.required],
    });
  }
  passwordValidator(form: FormGroup): boolean {
    const password = form.controls['password'].value;
    const confirmPassword = form.controls['confirmPassword'].value;
    return password !== confirmPassword;
  }
  signup(): void {
    this.isLoading = true;
    const data: SignUpDTO = {
      firstName: this.signupForm.value.firstName,
      lastName: this.signupForm.value.lastName,
      username: this.signupForm.value.username,
      email: this.signupForm.value.email,
      password: this.signupForm.value.password,
      phoneNumber: this.signupForm.value.phoneNumber,
      address: this.signupForm.value.address,
    };
    console.log(data);
    this.userService.signupRequest(data).subscribe(
      (res: BaseResponseDTO) => {
        console.log(res);
        this.isLoading = false;
        if (!res.status) {
          console.log(res);
          this.showToastMessage(res.statusMessage, 'error');
          this.signupForm.reset();
          return;
        }
        this.showToastMessage(res.statusMessage, 'success');
        this.router.navigateByUrl('/auth/sign-in');
      },
      (error) => {
        this.isLoading = false;
        console.log(error);
        console.error('error: ', error.error.statusMessage);
        this.signupForm.reset();
        this.showToastMessage(error.error.statusMessage, 'error');
        this.router.navigateByUrl('/auth/sign-up');
      }
    );
    this.signupForm.reset();
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
