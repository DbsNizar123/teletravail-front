import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DepartmentService {
  private apiUrl = 'http://localhost:8000/api/departments';

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No authentication token found.');
    }
    return new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    });
  }

  addDepartment(data: { name: string; description: string }): Observable<any> {
    return this.http
      .post(this.apiUrl, data, { headers: this.getHeaders() })
      .pipe(catchError(this.handleError));
  }

 getDepartments(page: number, limit: number): Observable<any> {
  return this.http.get(`${this.apiUrl}?page=${page}&limit=${limit}`, { headers: this.getHeaders() });
}

getAllDepartments(): Observable<any[]> {
  return new Observable((observer) => {
    let allDepartments: any[] = [];
    let page = 1;
    const limit = 6;

    const fetchPage = () => {
      this.getDepartments(page, limit).subscribe({
        next: (response) => {
          allDepartments = allDepartments.concat(response.data);
          if (response.data.length === limit) {
            page++;
            fetchPage();
          } else {
            observer.next(allDepartments);
            observer.complete();
          }
        },
        error: (error) => {
          observer.error(error);
        },
      });
    };
    fetchPage();
  });
}

  deleteDepartment(id: string): Observable<any> {
    return this.http
      .delete(`${this.apiUrl}/${id}`, { headers: this.getHeaders() })
      .pipe(catchError(this.handleError));
  }
  
getDepartmentById(id: string): Observable<any> {
  return this.http.get(`${this.apiUrl}/${id}`, { headers: this.getHeaders() }).pipe(
    catchError(this.handleError)
  );
}

updateDepartment(id: string, data: { name: string; description: string }): Observable<any> {
  return this.http.put(`${this.apiUrl}/${id}`, data, { headers: this.getHeaders() }).pipe(
    catchError(this.handleError)
  );
}

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'An error occurred.';
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Error: ${error.error.message}`;
    } else {
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    console.error(errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}