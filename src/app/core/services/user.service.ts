import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { LoginDTO, UserDetails, VerifyEmailDto } from '../../../types';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private userDetailsSubject = new BehaviorSubject<UserDetails | null>(null);
  userDetails$ = this.userDetailsSubject.asObservable();

  constructor(private apiService: ApiService, private router: Router) {}

  loginRequest(data: LoginDTO): Observable<any> {
    return this.apiService.postRequest('/api/UserAuth/login', data);
  }
  signupRequest(data: any): Observable<any> {
    return this.apiService.postRequest('/api/UserAuth/register', data);
  }
  storeToken(token: string): void {
    localStorage.setItem('jwtToken', token);
  }
  getToken(): string | null {
    return localStorage.getItem('jwtToken');
  }
  isLoggedIn(): boolean {
    return this.getToken() !== null;
  }
  logout(): void {
    localStorage.removeItem('jwtToken');
    this.router.navigateByUrl('/auth/sign-in');
  }
  getUserDetails(): Observable<any> {
    return this.apiService.authorisedGetRequest('/api/UserAuth/user/details');
  }
  setUserDetails(details: UserDetails): void {
    this.userDetailsSubject.next(details);
  }

  verifyEmail(data: VerifyEmailDto): Observable<any> {
    return this.apiService.postRequest('/api/UserAuth/user/verify', data);
  }
}
