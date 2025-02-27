import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { environment } from '../../../environments/environment';
import { ApiResponse, PaginatedResponse, QueryParams } from '../models/api-response.model';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  get<T>(endpoint: string, params?: QueryParams): Observable<T> {
    let httpParams = new HttpParams();
    
    if (params) {
      Object.keys(params).forEach(key => {
        if (params[key] !== null && params[key] !== undefined) {
          httpParams = httpParams.set(key, params[key].toString());
        }
      });
    }

    return this.http.get<ApiResponse<T>>(`${this.apiUrl}/${endpoint}`, { params: httpParams })
      .pipe(
        map(response => {
          if (response.success) {
            return response.data as T;
          } else {
            throw new Error(response.message || 'API request failed');
          }
        }),
        catchError(error => {
          return throwError(() => error);
        })
      );
  }

  getPaginated<T>(endpoint: string, params?: QueryParams): Observable<PaginatedResponse<T>['data']> {
    let httpParams = new HttpParams();
    
    if (params) {
      Object.keys(params).forEach(key => {
        if (params[key] !== null && params[key] !== undefined) {
          httpParams = httpParams.set(key, params[key].toString());
        }
      });
    }

    return this.http.get<PaginatedResponse<T>>(`${this.apiUrl}/${endpoint}`, { params: httpParams })
      .pipe(
        map(response => {
          if (response.success) {
            return response.data;
          } else {
            throw new Error(response.message || 'API request failed');
          }
        }),
        catchError(error => {
          return throwError(() => error);
        })
      );
  }

  post<T>(endpoint: string, data: any): Observable<T> {
    return this.http.post<ApiResponse<T>>(`${this.apiUrl}/${endpoint}`, data)
      .pipe(
        map(response => {
          if (response.success) {
            return response.data as T;
          } else {
            throw new Error(response.message || 'API request failed');
          }
        }),
        catchError(error => {
          return throwError(() => error);
        })
      );
  }

  put<T>(endpoint: string, data: any): Observable<T> {
    return this.http.put<ApiResponse<T>>(`${this.apiUrl}/${endpoint}`, data)
      .pipe(
        map(response => {
          if (response.success) {
            return response.data as T;
          } else {
            throw new Error(response.message || 'API request failed');
          }
        }),
        catchError(error => {
          return throwError(() => error);
        })
      );
  }

  patch<T>(endpoint: string, data: any): Observable<T> {
    return this.http.patch<ApiResponse<T>>(`${this.apiUrl}/${endpoint}`, data)
      .pipe(
        map(response => {
          if (response.success) {
            return response.data as T;
          } else {
            throw new Error(response.message || 'API request failed');
          }
        }),
        catchError(error => {
          return throwError(() => error);
        })
      );
  }

  delete<T>(endpoint: string): Observable<T> {
    return this.http.delete<ApiResponse<T>>(`${this.apiUrl}/${endpoint}`)
      .pipe(
        map(response => {
          if (response.success) {
            return response.data as T;
          } else {
            throw new Error(response.message || 'API request failed');
          }
        }),
        catchError(error => {
          return throwError(() => error);
        })
      );
  }
}
