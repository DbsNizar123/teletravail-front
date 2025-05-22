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
  private rolesSubject = new BehaviorSubject<string[]>([]); // To emit roles updates

  constructor(private http: HttpClient, private router: Router) {
    // Load roles from local storage or API on initialization
    this.loadUserRoles();
  }

  // Check if the user is logged in
  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  // Load user roles (call API or retrieve from local storage)
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
          localStorage.setItem('userRoles', JSON.stringify(roles)); // Cache roles
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

  // Get user roles from API
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

  // Get roles as an Observable (for async handling in AuthGuard)
  getCurrentUserRolesAsync(): Observable<string[]> {
    return this.rolesSubject.asObservable();
  }

  // Check if the user has a specific role
  hasRole(role: string): boolean {
    return this.userRoles.includes(role);
  }

  // Get the current user's roles (synchronous, for non-critical use)
  getCurrentUserRoles(): string[] {
    return this.userRoles;
  }

  // Login method
  login(credentials: { email: string; password: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, credentials).pipe(
      map((response: any) => {
        if (response.success && response.token) {
          localStorage.setItem('token', response.token);
          this.loadUserRoles(); // Fetch roles after login
        }
        return response;
      })
    );
  }

  // Logout method
  logout(): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    });
    return this.http.post(`${this.apiUrl}/logout`, {}, { headers }).pipe(
      map((response) => {
        localStorage.removeItem('token');
        localStorage.removeItem('userRoles'); // Clear cached roles
        this.userRoles = [];
        this.rolesSubject.next([]);
        this.router.navigate(['/login']);
        return response;
      })
    );
  }

  // Add a new user
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

  // Get all users with pagination
  getAllUsers(page: number, limit: number): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    });
    return this.http.get(`${this.apiUrl}/users?page=${page}&limit=${limit}`, { headers });
  }

  // Update a user
  updateUser(userId: number, userData: any): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    });
    return this.http.put(`${this.apiUrl}/users/${userId}`, userData, { headers });
  }

  // Delete a user
  deleteUser(userId: number): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    });
    return this.http.delete(`${this.apiUrl}/users/${userId}`, { headers });
  }

  // Get user profile
  getProfile(): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    });
    return this.http.get(`${this.apiUrl}/profile`, { headers });
  }

  // Update user profile
  updateProfile(data: any): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    });
    return this.http.put(`${this.apiUrl}/profile`, data, { headers });
  }

  // Get user by ID
  getUserById(userId: number): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    });
    return this.http.get(`${this.apiUrl}/users/${userId}`, { headers });
  }

  // Send password reset link
  sendResetLinkEmail(email: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/forgot-password`, { email });
  }

  // Reset password
  resetPassword(data: {
    token: string;
    email: string;
    password: string;
    password_confirmation: string;
  }): Observable<any> {
    return this.http.post(`${this.apiUrl}/reset-password`, data);
  }
}