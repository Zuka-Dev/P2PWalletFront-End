import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../../../core/services/user.service';
import { BaseResponseDTO } from '../../../../types';

@Component({
  selector: 'app-sign-in',
  standalone: false,
  templateUrl: './sign-in.component.html',
  styleUrl: './sign-in.component.scss',
})
export class SignInComponent {
  isLoading: boolean = false;
  responseMessage!: { title: string; description?: string };
  constructor(private fb: FormBuilder, private userService: UserService) {}
  signinForm!: FormGroup;
  type: string = 'password';
  ngOnInit(): void {
    this.signinForm = this.fb.group({
      email: ['', Validators.required],
      password: ['', Validators.required],
    });
  }
  signin(): void {
    this.isLoading = true;
    if (!this.signinForm.invalid) {
      this.isLoading = false;
      this.responseMessage = {
        title: 'Invalid Details entered',
      };
    }
    /*
    response -> error -> data,status,statusMessage
             -> ok(bool) ,status,statusText,url
     */
    console.log(this.signinForm.value);
    this.userService
      .loginRequest(this.signinForm.value)
      .subscribe((response: BaseResponseDTO | any) => {
        this.isLoading = false;
        console.log(response);
        if (!response.status) {
          console.log('error: ', response.error);
          this.signinForm.reset();
          this.responseMessage = {
            title: 'Error Occurred',
            description: response.statusMessage,
          };
        }
        localStorage.setItem('jwtToken', response.data.jwtToken);
      });
  }
}
