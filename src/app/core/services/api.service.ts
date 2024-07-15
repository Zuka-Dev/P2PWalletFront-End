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
    return this.http.get(url);
  }
  postRequest(url: string, data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}${url}`, data, {
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
