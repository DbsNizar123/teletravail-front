// src/app/services/statistics.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class StatisticsService {
  private apiUrl = 'http://localhost:8000/api/statistics';

  constructor(private http: HttpClient) { }

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    });
  }

  getStatistics(departmentMonth?: string): Observable<any> {
    const params: any = {};
    if (departmentMonth) {
      params.department_month = departmentMonth;
    }

    return this.http.get(this.apiUrl, {
      headers: this.getHeaders(),
      params
    }).pipe(
      catchError((error) => {
        console.error('Error fetching statistics:', error);
        return throwError(() => new Error('Failed to load statistics'));
      })
    );
  }
}