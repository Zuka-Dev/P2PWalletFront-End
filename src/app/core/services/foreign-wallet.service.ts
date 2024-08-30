import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { CreateForeignWalletDTO } from '../../../types';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ForeignWalletService {
  constructor(private _apiService: ApiService) {}

  createForeignWallet(data: CreateForeignWalletDTO): Observable<any> {
    return this._apiService.authorisedPostRequest(
      '/api/ForeignWallet/create',
      data
    );
  }
}
