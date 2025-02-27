import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from './interceptors/auth.interceptor';
import { AuthGuard } from './guards/auth.guard';
import { RoleGuard } from './guards/role.guard';
import { AuthService } from './services/auth.service';
import { ApiService } from './services/api.service';

export const httpInterceptorProviders = [
  { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }
];

export const coreProviders = [
  AuthService,
  ApiService,
  AuthGuard,
  RoleGuard
];
