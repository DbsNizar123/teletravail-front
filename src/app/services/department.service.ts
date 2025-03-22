import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DepartmentService {
  private apiUrl = 'http://localhost:8000/api/departments'; // API endpoint for departments

  constructor(private http: HttpClient) {}

  // Helper method to get headers with the authentication token
  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token'); // Retrieve the token from localStorage
    if (!token) {
      throw new Error('No authentication token found.');
    }
    return new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    });
  }

  // Add a new department
  addDepartment(data: { name: string; description: string }): Observable<any> {
    return this.http
      .post(this.apiUrl, data, { headers: this.getHeaders() })
      .pipe(catchError(this.handleError));
  }

  // Get all departments
  getDepartments(page: number = 1, limit: number = 6): Observable<any> {
    return this.http
        .get(`${this.apiUrl}?page=${page}&limit=${limit}`, { headers: this.getHeaders() })
        .pipe(catchError(this.handleError));
}

  // Delete a department by ID
  deleteDepartment(id: string): Observable<any> {
    return this.http
      .delete(`${this.apiUrl}/${id}`, { headers: this.getHeaders() })
      .pipe(catchError(this.handleError));
  }

  // Error handling method
  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'An error occurred.';
    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    console.error(errorMessage); // Log the error for debugging
    return throwError(() => new Error(errorMessage));
  }
}