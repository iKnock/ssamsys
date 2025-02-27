import { Injectable } from '@angular/core';
import { 
  CanActivate, 
  ActivatedRouteSnapshot, 
  RouterStateSnapshot, 
  Router 
} from '@angular/router';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {
  
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}
  
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    return this.authService.currentUser$.pipe(
      take(1),
      map(user => {
        // First check if the user is authenticated
        if (!user) {
          this.router.navigate(['/auth/login'], { queryParams: { returnUrl: state.url } });
          return false;
        }
        
        // Check if route has data.roles and if user has the required role
        if (route.data['roles'] && route.data['roles'].length > 0) {
          if (route.data['roles'].includes(user.role)) {
            return true;
          } else {
            // User doesn't have the required role
            this.router.navigate(['/unauthorized']);
            return false;
          }
        }
        
        // If no specific roles are required, allow access
        return true;
      })
    );
  }
}
