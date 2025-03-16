import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs'; // Importez catchError et throwError

@Injectable({
  providedIn: 'root',
})
export class TeletravailRequestService {
  private apiUrl = 'http://localhost:8000/api'; // Remplacez par l'URL de votre API

  constructor(private http: HttpClient) {}

  // Soumettre une demande de télétravail
  submitRequest(data: { date: string; reason: string }): Observable<any> {
    const token = localStorage.getItem('token'); // Récupérer le token depuis le localStorage
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`, // Inclure le token dans les en-têtes
    });

    return this.http.post(`${this.apiUrl}/teletravail-requests`, data, { headers }).pipe(
      catchError(this.handleError) // Gestion des erreurs
    );
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