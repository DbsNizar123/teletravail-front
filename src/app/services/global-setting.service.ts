import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class GlobalSettingService {
  private apiUrl = 'http://localhost:8000/api/global-settings';

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    });
  }

  getSettings(): Observable<any> {
    return this.http.get(this.apiUrl, { headers: this.getHeaders() }).pipe(catchError(this.handleError));
  }

  addSetting(data: any): Observable<any> {
    return this.http.post(this.apiUrl, data, { headers: this.getHeaders() }).pipe(catchError(this.handleError));
  }

  updateSetting(id: string, data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, data, { headers: this.getHeaders() }).pipe(catchError(this.handleError));
  }

  deleteSetting(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`, { headers: this.getHeaders() }).pipe(catchError(this.handleError));
  }
  checkAvailability(date: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/check-availability?date=${date}`, { 
      headers: this.getHeaders() 
    }).pipe(catchError(this.handleError));
  }

  private handleError(error: any) {
    console.error('Erreur:', error);
    return throwError(() => new Error('Erreur lors de la communication avec le serveur'));
  }
}