import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
} from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router) {}
  exclude_urls = [];
  urls_can_visit_bfr_login = ['/login', '/registration', , '/support', '/'];
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    //   if (this.auth.currentUserValue?.token) {
    //     if (state.url.indexOf('/login') != -1) {
    //       this.router.navigate(['/dashboard']);
    //     }
    //     return true;
    //   } else {
    //     if (state.url.indexOf('/login') != -1) {
    //       return true;
    //     }
    //     if (this.urls_can_visit_bfr_login.indexOf(state.url) != -1) {
    //       return true;
    //     }
    //     if (state.url && state.url.indexOf('/dashboard') != -1) {
    //       return true;
    //     }
    //     this.router.navigate(['/dashboard']);
    //   }
    return true;
  }
}
