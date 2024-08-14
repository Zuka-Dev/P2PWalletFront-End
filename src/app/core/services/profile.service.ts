import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Observable } from 'rxjs';
import {
  ChangePasswordDTO,
  ChangePinDTO,
  CreatePinDTO,
  SecurityAnswer,
  UpdateProfileDTO,
} from '../../../types';

@Injectable({
  providedIn: 'root',
})
export class ProfileService {
  constructor(private _apiService: ApiService) {}

  getSecurityQuestions(): Observable<any> {
    return this._apiService.authorisedGetRequest('/api/SecurityQuestions');
  }
  postSecurityAnswer(data: SecurityAnswer): Observable<any> {
    return this._apiService.authorisedPostRequest(
      '/api/SecurityQuestions',
      data
    );
  }
  checkSecurityAnswer(data: any): Observable<any> {
    return this._apiService.authorisedPostRequest(
      '/api/SecurityQuestions/answer',
      data
    );
  }
  getSecurityQuestionById(id: number): Observable<any> {
        return this._apiService.authorisedGetRequest(`/api/SecurityQuestions/${id}`);

  }
  updateProfile(data: UpdateProfileDTO): Observable<any> {
    return this._apiService.authorisedPutRequest(
      '/api/UserAuth/user/updateUser',
      data
    );
  }
  createPin(data: CreatePinDTO): Observable<any> {
    return this._apiService.authorisedPostRequest(
      '/api/UserAuth/user/createPin',
      data
    );
  }
  changePin(data: ChangePinDTO): Observable<any> {
    return this._apiService.authorisedPostRequest(
      '/api/UserAuth/user/changePin',
      data
    );
  }
  changePassword(data: ChangePasswordDTO): Observable<any> {
    return this._apiService.authorisedPostRequest(
      '/api/UserAuth/user/changePassword',
      data
    );
  }
}
