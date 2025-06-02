import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of, BehaviorSubject } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://localhost:8000/api';
  private userRoles: string[] = [];
  private rolesSubject = new BehaviorSubject<string[]>([]); 

  constructor(private http: HttpClient, private router: Router) {

    this.loadUserRoles();
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  private loadUserRoles(): void {
    const token = localStorage.getItem('token');
    const cachedRoles = localStorage.getItem('userRoles');
    if (cachedRoles) {
      this.userRoles = JSON.parse(cachedRoles);
      this.rolesSubject.next(this.userRoles);
    }
    if (token) {
      this.getUserRoles().subscribe(
        (roles) => {
          this.userRoles = roles;
          localStorage.setItem('userRoles', JSON.stringify(roles));
          this.rolesSubject.next(roles);
        },
        (error) => {
          console.error('Error fetching roles:', error);
          this.userRoles = [];
          this.rolesSubject.next([]);
          localStorage.removeItem('userRoles');
        }
      );
    }
  }

  getUserRoles(): Observable<string[]> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    });
    return this.http.get<string[]>(`${this.apiUrl}/user/roles`, { headers }).pipe(
      catchError(() => {
        return of([]);
      })
    );
  }

  getCurrentUserRolesAsync(): Observable<string[]> {
    return this.rolesSubject.asObservable();
  }

  hasRole(role: string): boolean {
    return this.userRoles.includes(role);
  }

  getCurrentUserRoles(): string[] {
    return this.userRoles;
  }

  login(credentials: { email: string; password: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, credentials).pipe(
      map((response: any) => {
        if (response.success && response.token) {
          localStorage.setItem('token', response.token);
          this.loadUserRoles();
        }
        return response;
      })
    );
  }

  logout(): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    });
    return this.http.post(`${this.apiUrl}/logout`, {}, { headers }).pipe(
      map((response) => {
        localStorage.removeItem('token');
        localStorage.removeItem('userRoles'); 
        this.userRoles = [];
        this.rolesSubject.next([]);
        this.router.navigate(['/login']);
        return response;
      })
    );
  }

  addUser(userData: {
    name: string;
    email: string;
    password: string;
    role: string;
    department_id: number;
  }): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    });
    return this.http.post(`${this.apiUrl}/addUser`, userData, { headers });
  }

  getAllUsers(page: number, limit: number): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    });
    return this.http.get(`${this.apiUrl}/users?page=${page}&limit=${limit}`, { headers });
  }

  updateUser(userId: number, userData: any): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    });
    return this.http.put(`${this.apiUrl}/users/${userId}`, userData, { headers });
  }

  deleteUser(userId: number): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    });
    return this.http.delete(`${this.apiUrl}/users/${userId}`, { headers });
  }

  getProfile(): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    });
    return this.http.get(`${this.apiUrl}/profile`, { headers });
  }

  updateProfile(data: any): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    });
    return this.http.put(`${this.apiUrl}/profile`, data, { headers });
  }

  getUserById(userId: number): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    });
    return this.http.get(`${this.apiUrl}/users/${userId}`, { headers });
  }

  sendResetLinkEmail(email: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/forgot-password`, { email });
  }

  resetPassword(data: {
    token: string;
    email: string;
    password: string;
    password_confirmation: string;
  }): Observable<any> {
    return this.http.post(`${this.apiUrl}/reset-password`, data);
  }
}