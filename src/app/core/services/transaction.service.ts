import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TransactionService {
  constructor(private _apiservice: ApiService) {}

  getAllTransactions(): Observable<any> {
    let url = '/api/Transfer';
    return this._apiservice.authorisedGetRequest(url);
  }
  getAllDeposits():Observable<any>{
    let url = '/api/Deposit';
    return this._apiservice.authorisedGetRequest(url);
  }
}
