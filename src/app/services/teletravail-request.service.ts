import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class TeletravailRequestService {
  private apiUrl = 'http://localhost:8000/api';

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token || ''}`
    });
  }

  submitRequest(data: { date: string; reason: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/teletravail-requests`, data, { headers: this.getHeaders() }).pipe(
      catchError(this.handleError)
    );
  }

  getRequests(page: number = 1, limit: number = 6): Observable<any> {
    return this.http.get(`${this.apiUrl}/teletravail-requests?page=${page}&limit=${limit}`, { headers: this.getHeaders() })
      .pipe(catchError(this.handleError));
  }

  getRequestById(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/teletravail-requests/${id}`, { headers: this.getHeaders() })
      .pipe(catchError(this.handleError));
  }

  updateRequest(id: string, data: { date?: string; reason?: string }): Observable<any> {
    return this.http.put(`${this.apiUrl}/teletravail-requests/${id}`, data, { headers: this.getHeaders() })
      .pipe(catchError(this.handleError));
  }

  getAllRequestss(page: number = 1, limit: number = 10): Observable<any> {
    return this.http.get(`${this.apiUrl}/show-requests?page=${page}&limit=${limit}`, { headers: this.getHeaders() })
      .pipe(catchError(this.handleError));
  }

  updateRequestStatus(id: string, status: string): Observable<any> {
    return this.http.put(
      `${this.apiUrl}/teletravail-requests/${id}/status`,
      { status },
      { headers: this.getHeaders() }
    ).pipe(
      catchError(this.handleError)
    );
  }

  getRequestsByUser(userId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/teletravail-requests/user/${userId}`, { headers: this.getHeaders() })
      .pipe(catchError(this.handleError));
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'Une erreur est survenue lors de la communication avec le serveur.';
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Erreur client: ${error.error.message}`;
    } else {
      if (error.status === 403) {
        errorMessage = error.error.message || 'Action non autorisée.';
      } else if (error.status === 400) {
        errorMessage = error.error.message || 'Requête invalide.';
      } else if (error.status === 500) {
        errorMessage = error.error.message || 'Erreur interne du serveur.';
      } else if (error.error?.message) {
        errorMessage = error.error.message;
      }
      errorMessage = `Code: ${error.status} - ${errorMessage}`;
    }
    console.error('API Error:', errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}