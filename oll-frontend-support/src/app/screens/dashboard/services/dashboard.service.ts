import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  constructor(private http: HttpClient) {}

  updateLoginStatus(postParams: any): Observable<any> {
    return this.http.post(
      `${environment.support_system_prefix}/updateAvailabilityStatus`,
      postParams
    );
  }

  attendRequest(payload): Observable<any> {
    return this.http.post(
      `${environment.support_system_prefix}/attendRequest`,
      payload
    );
  }

  joinUser(payload): Observable<any> {
    return this.http.post(
      `${environment.support_system_prefix}/joinUser`,
      payload
    );
  }

  joinSupport(payload): Observable<any> {
    return this.http.post(
      `${environment.support_system_prefix}/joinSupport`,
      payload
    );
  }

  requestHistory(payload): Observable<any> {
    return this.http.post(
      `${environment.support_system_prefix}/requestsHistory`,
      payload
    );
  }

  closeRequest(postParams: any): Observable<any> {
    return this.http.post(
      `${environment.support_system_prefix}/closeRequest`,
      postParams
    );
  }

  expertsRoleCount() {
    return this.http.get(`${environment.auth_prefix}/nonPrimaryRoleCount`);
  }

  getQueueRequest() {
    return this.http.get(
      `${environment.support_system_prefix}/getRequestsQueue`
    );
  }

  getUserList() {
    return this.http.get(`${environment.auth_prefix}/getUserList`);
  }
}
