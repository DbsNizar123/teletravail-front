// notification.service.ts

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private apiUrl = 'http://localhost:8000/api';

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    });
  }

  getNotifications(page: number = 1, limit: number = 10): Observable<any> {
    return this.http.get(`${this.apiUrl}/notifications?page=${page}&limit=${limit}`, { headers: this.getHeaders() })
      .pipe(catchError(this.handleError));
  }

  markAsRead(notificationIds: number[]): Observable<any> {
    return this.http.put(`${this.apiUrl}/notifications/mark-as-read`, { notification_ids: notificationIds }, { headers: this.getHeaders() })
      .pipe(catchError(this.handleError));
  }

  markAllAsRead(): Observable<any> {
    return this.http.put(`${this.apiUrl}/notifications/mark-all-as-read`, {}, { headers: this.getHeaders() })
      .pipe(catchError(this.handleError));
  }

  // New method to delete a notification
  deleteNotification(notificationId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/notifications/${notificationId}`, { headers: this.getHeaders() })
      .pipe(catchError(this.handleError));
  }

  private handleError(error: any) {
    let errorMessage = 'Une erreur est survenue.';
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Erreur : ${error.error.message}`;
    } else {
      errorMessage = `Code d'erreur : ${error.status}\nMessage : ${error.message}`;
    }
    console.error(errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}