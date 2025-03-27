import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TeletravailRequestService {
  private apiUrl = 'http://localhost:8000/api'; // Remplacez par l'URL de votre API

  constructor(private http: HttpClient) {}

  // Configurer les en-têtes avec le token d'authentification
  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    });
  }

  // Soumettre une demande de télétravail
  submitRequest(data: { date: string; reason: string;  }): Observable<any> {
    return this.http.post(`${this.apiUrl}/teletravail-requests`, data, { headers: this.getHeaders() })
      .pipe(catchError(this.handleError));
  }

  // Obtenir toutes les demandes de télétravail
  getRequests(page: number = 1, limit: number = 6): Observable<any> {
    return this.http.get(`${this.apiUrl}/teletravail-requests?page=${page}&limit=${limit}`, { headers: this.getHeaders() })
      .pipe(catchError(this.handleError));
  }

  // Obtenir une demande spécifique par ID
  getRequestById(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/teletravail-requests/${id}`, { headers: this.getHeaders() })
      .pipe(catchError(this.handleError));
  }

  // Mettre à jour une demande de télétravail
  updateRequest(id: string, data: { date?: string; reason?: string }): Observable<any> {
    return this.http.put(`${this.apiUrl}/teletravail-requests/${id}`, data, { headers: this.getHeaders() })
      .pipe(catchError(this.handleError));
  }

  getRequestsByUser(userId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/teletravail-requests/user/${userId}`, { headers: this.getHeaders() })
      .pipe(catchError(this.handleError));
  }
  // Gestion des erreurs
  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Une erreur est survenue.';
    if (error.error instanceof ErrorEvent) {
      // Erreur côté client
      errorMessage = `Erreur : ${error.error.message}`;
    } else {
      // Erreur côté serveur
      errorMessage = `Code d'erreur : ${error.status}\nMessage : ${error.message}`;
    }
    console.error(errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}