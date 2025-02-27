import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { Router } from '@angular/router';

import { environment } from '../../../environments/environment';
import { User, AuthResponse, LoginRequest, RegisterRequest } from '../models/user.model';
import { ApiResponse } from '../models/api-response.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();
  
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  private apiUrl = `${environment.apiUrl}/auth`;

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  public get currentUserValue(): User | null {
    return this.currentUserSubject.value;
  }

  login(email: string, password: string): Observable<User> {
    return this.http.post<ApiResponse<AuthResponse>>(`${this.apiUrl}/login`, { email, password })
      .pipe(
        map(response => {
          if (response.success && response.data) {
            this.setSession(response.data);
            this.currentUserSubject.next(response.data.user);
            this.isAuthenticatedSubject.next(true);
            return response.data.user;
          } else {
            throw new Error(response.message || 'Login failed');
          }
        }),
        catchError(error => {
          return throwError(() => error);
        })
      );
  }

  register(userData: RegisterRequest): Observable<User> {
    return this.http.post<ApiResponse<AuthResponse>>(`${this.apiUrl}/register`, userData)
      .pipe(
        map(response => {
          if (response.success && response.data) {
            this.setSession(response.data);
            this.currentUserSubject.next(response.data.user);
            this.isAuthenticatedSubject.next(true);
            return response.data.user;
          } else {
            throw new Error(response.message || 'Registration failed');
          }
        }),
        catchError(error => {
          return throwError(() => error);
        })
      );
  }

  logout(): void {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user');
    localStorage.removeItem('expires_at');
    this.currentUserSubject.next(null);
    this.isAuthenticatedSubject.next(false);
    this.router.navigate(['/auth/login']);
  }

  checkAuthStatus(): void {
    const token = localStorage.getItem('auth_token');
    const userStr = localStorage.getItem('user');
    const expiresAt = localStorage.getItem('expires_at');
    
    if (token && userStr && expiresAt) {
      const expirationDate = new Date(expiresAt);
      if (expirationDate > new Date()) {
        const user = JSON.parse(userStr) as User;
        this.currentUserSubject.next(user);
        this.isAuthenticatedSubject.next(true);
      } else {
        this.logout();
      }
    }
  }

  forgotPassword(email: string): Observable<any> {
    return this.http.post<ApiResponse<any>>(`${this.apiUrl}/forgot-password`, { email })
      .pipe(
        map(response => {
          if (response.success) {
            return response.data;
          } else {
            throw new Error(response.message || 'Failed to send password reset email');
          }
        }),
        catchError(error => {
          return throwError(() => error);
        })
      );
  }

  resetPassword(token: string, password: string): Observable<any> {
    return this.http.post<ApiResponse<any>>(`${this.apiUrl}/reset-password`, { token, password })
      .pipe(
        map(response => {
          if (response.success) {
            return response.data;
          } else {
            throw new Error(response.message || 'Failed to reset password');
          }
        }),
        catchError(error => {
          return throwError(() => error);
        })
      );
  }

  changePassword(oldPassword: string, newPassword: string): Observable<any> {
    return this.http.post<ApiResponse<any>>(`${this.apiUrl}/change-password`, { oldPassword, newPassword })
      .pipe(
        map(response => {
          if (response.success) {
            return response.data;
          } else {
            throw new Error(response.message || 'Failed to change password');
          }
        }),
        catchError(error => {
          return throwError(() => error);
        })
      );
  }

  private setSession(authResult: AuthResponse): void {
    // Set token expiration to 24 hours from now
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 24);

    localStorage.setItem('auth_token', authResult.token);
    localStorage.setItem('user', JSON.stringify(authResult.user));
    localStorage.setItem('expires_at', expiresAt.toISOString());
  }

  hasRole(role: string | string[]): boolean {
    const user = this.currentUserValue;
    if (!user) return false;
    
    if (Array.isArray(role)) {
      return role.includes(user.role);
    }
    
    return user.role === role;
  }
}
