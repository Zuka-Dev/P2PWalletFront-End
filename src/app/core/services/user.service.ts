import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Observable } from 'rxjs';
import { LoginDTO } from '../../../types';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private apiService: ApiService) {}

  loginRequest(data: LoginDTO): Observable<any> {
    return this.apiService.postRequest('/api/UserAuth/login', data);
  }
  signupRequest(data: any): Observable<any> {
    return this.apiService.postRequest('/api/UserAuth/signup', data);
  }
}
