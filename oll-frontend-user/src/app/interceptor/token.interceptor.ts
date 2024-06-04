import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from '@angular/common/http';

import { Observable } from 'rxjs';
import { AppPreferencesService } from '../modules/shared/services/app-preferences.service';
import { DeviceDetectorService } from 'ngx-device-detector';
import { environment } from 'src/environments/environment';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  constructor(
    private appPreferences: AppPreferencesService,
    private deviceService: DeviceDetectorService
  ) {}
  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const deviceInfo = this.deviceService.getDeviceInfo();
    const isMobile = this.deviceService.isMobile();
    const isTablet = this.deviceService.isTablet();
    const isDesktopDevice = this.deviceService.isDesktop();
    const userToken = this.appPreferences.getValue('user_token');
    const device_ip = this.appPreferences.getValue('device-ip');
    let headers = {
      'uo-device-type': deviceInfo.deviceType,
      'uo-os': deviceInfo.os,
      'uo-os-version': deviceInfo.os_version,
      'uo-is-mobile': '' + isMobile,
      'uo-is-tablet': '' + isTablet,
      'uo-is-desktop': '' + isDesktopDevice,
      'uo-browser-version': deviceInfo.browser_version,
      'uo-browser': deviceInfo.browser,
      'uo-client-id': environment.client_id,
      'uo-client-ip': JSON.parse(device_ip),
    };

    if (userToken) {
      headers['Authorization'] = JSON.parse(userToken);
    }
    if (!request.url.includes('api.ipify.org')) {
      request = request.clone({
        setHeaders: headers,
      });
    }
    return next.handle(request);
  }
}
