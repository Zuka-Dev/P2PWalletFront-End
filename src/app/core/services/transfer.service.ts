import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TransferService {
  constructor(private apiService: ApiService) {}

  transferFunds(data: any): Observable<any> {
    return this.apiService.authorisedPostRequest('/api/Account/transfer', data);
  }
  fundAccounts(data: any): Observable<any> {
    return this.apiService.authorisedPostRequest('/api/Deposit', data);
  }
  getAccounts(): Observable<any> {
    return this.apiService.authorisedGetRequest('/api/Account');
  }
}
