import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private readonly baseUrl: string = 'https://localhost:7125';
  constructor(private http: HttpClient) {}

  getRequest(url: string): Observable<any> {
    return this.http.get(`${this.baseUrl}${url}`);
  }
  authorisedGetRequest(url: string): Observable<any> {
    return this.http.get(`${this.baseUrl}${url}`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('jwtToken')}`,
      },
    });
  }
  postRequest(url: string, data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}${url}`, data, {
      headers: { 'Content-Type': 'application/json' },
    });
  }
  authorisedPostRequest(url: string, data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}${url}`, data, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('jwtToken')}`,
      },
    });
  }
  authorisedPutRequest(url: string, data: any): Observable<any> {
    return this.http.put(`${this.baseUrl}${url}`, data, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('jwtToken')}`,
      },
    });
  }
}
