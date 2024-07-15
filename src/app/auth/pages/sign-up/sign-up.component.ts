import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../../../core/services/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sign-up',
  standalone: false,
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.scss',
})
export class SignUpComponent {
  signupForm!: FormGroup;
  isLoading: boolean = false;
  data!: object;
  responseMessage!: { title: string; description?: string };

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private router: Router
  ) {}
  ngOnInit(): void {
    this.signupForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', Validators.required, Validators.email],
      phoneNumber: ['', Validators.required],
      password: ['', Validators.required],
      confirmPassword: [
        '',
        Validators.required,
        { validators: this.passwordValidator },
      ],
      address: ['', Validators.required],
    });
    this.data = {
      firstName: this.signupForm.value.firstName,
      lastName: this.signupForm.value.lastName,
      email: this.signupForm.value.email,
      password: this.signupForm.value.password,
      phoneNumber: this.signupForm.value.phoneNumber,
      address: this.signupForm.value.address,
    };
  }
  passwordValidator(form: FormGroup): void {
    const password = form.get('password');
    const confirmPassword = form.get('confirmPassword');
    if (password?.value !== confirmPassword?.value) {
      confirmPassword?.setErrors({ notMatch: true });
    } else {
      confirmPassword?.setErrors(null);
    }
  }
  signup(): void {
    if (this.signupForm.valid) {
      this.isLoading = true;
      this.userService.signupRequest(this.data).subscribe((res) => {
        this.isLoading = false;
        console.log(res);
        if (!res.status) {
          console.log(res);
          this.responseMessage = {
            title: 'User sign up Unsuccessful',
            description: 'Error creating user',
          };
          this.signupForm.reset();
          return;
        }
        this.responseMessage = {
          title: 'User successfully created',
          description: 'User has been successfully created in the application',
        };
        this.router.navigateByUrl('/auth/sign-in');
      });
      this.signupForm.reset();
      this.isLoading = false;
    }
  }
}
