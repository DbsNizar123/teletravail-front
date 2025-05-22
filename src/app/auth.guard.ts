// src/app/guards/auth.guard.ts
import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | boolean {
    // Check if the user is logged in
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
      return false;
    }

    // Get expected roles from route data
    const expectedRoles = route.data['roles'] as string[];

    // If no roles are specified, allow access if authenticated
    if (!expectedRoles || expectedRoles.length === 0) {
      return true;
    }

    // Check if the user has any of the expected roles
    return this.authService.getCurrentUserRolesAsync().pipe(
      take(1),
      map((roles) => {
        const hasRole = roles.some((role) => expectedRoles.includes(role));
        if (!hasRole) {
          this.router.navigate(['/unauthorized']);
          return false;
        }
        return true;
      })
    );
  }
}