import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CustomerSupportModalService {
  constructor(private http: HttpClient) {}

  createRequest(postParams: any): Observable<any> {
    return this.http.post(
      `${environment.support_system_prefix}/createRequest`,
      postParams
    );
  }

  deniedWaiting(postParams: any): Observable<any> {
    return this.http.post(
      `${environment.support_system_prefix}/userDeniedWaiting`,
      postParams
    );
  }

  joinUser(payload): Observable<any> {
    return this.http.post(
      `${environment.support_system_prefix}/joinUser`,
      payload
    );
  }
}
