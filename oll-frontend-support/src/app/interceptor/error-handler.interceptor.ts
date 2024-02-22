import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError } from 'rxjs';
import { AppPreferencesService } from '../modules/shared/services/app-preferences.service';
import { Router } from '@angular/router';
import { AuthService } from '../screens/auth/services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { UtilityService } from '../modules/shared/services/utility.service';

@Injectable({
  providedIn: 'root',
})
export class ErrorHandlerInterceptor {
  constructor(
    private utilityService: UtilityService,
    private router: Router,
    private authService: AuthService,
    private appPreferences: AppPreferencesService
  ) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return next
      .handle(request)
      .pipe(catchError((error) => this.errorHandler(error)));
  }

  private errorHandler(response: HttpEvent<any>): Observable<HttpEvent<any>> {
    const isJson = (str: string) => {
      try {
        JSON.parse(str);
      } catch (e) {
        return false;
      }
      return true;
    };
    if (response instanceof HttpErrorResponse) {
      switch (response.status) {
        case 401: // login
          if (this.appPreferences.getValue('user_token')) {
            this.router.navigateByUrl('/unauthorized');
          }
          setTimeout(() => {
            this.authService.logout();
          }, 1000);
          break;
        case 403: // forbidden
          this.router.navigateByUrl('/forbidden');
          break;
        case 400:
          if (response.error) {
            if (typeof response.error === 'string') {
              if (isJson(response.error)) {
                const errmsg = JSON.parse(response.error);
                this.utilityService.showErrorMessage(errmsg);
              }
            } else {
              try {
                this.utilityService.showErrorMessage(response.error.error);
              } catch (e) {
                console.error('Error!!! ', e);
              }
            }
          } else {
            this.utilityService.showErrorMessage(response.error.error);
          }
          break;
        case 0:
          if (window.navigator.onLine) {
            this.utilityService.showErrorMessage(
              'Something went wrong. Please try again!'
            );
            break;
          } else if (!window.navigator.onLine) {
            this.utilityService.showErrorMessage(
              'Something went wrong. Please try again!'
            );
            break;
          } else {
            break;
          }
      }
    }
    throw response;
  }
}
