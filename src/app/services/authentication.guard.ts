import { inject, Injectable } from '@angular/core';
import { CanActivateFn, CanActivateChildFn, CanLoadFn, Router } from '@angular/router';
import { TimeTableApiService } from './time-api-service';

// Class-based guard (recommended for shared logic)
@Injectable({
  providedIn: 'root'
})
export class AuthenticationGuard {
  private authService = inject(TimeTableApiService);
  private router = inject(Router);

  canActivate: CanActivateFn = () => this.authenticate();
  canActivateChild: CanActivateChildFn = () => this.authenticate();
  canLoad: CanLoadFn = () => this.authenticate();

  private authenticate(): boolean {
    const currentUser = this.authService.user.getValue();
    if (!this.authService.isUserLoggedIn() || !currentUser) {
      this.router.navigateByUrl("/login");
      return false;
    }
    return true;
  }
}
