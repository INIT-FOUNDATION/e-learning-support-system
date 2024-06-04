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

  joinIncognitoMode(payload): Observable<any> {
    return this.http.post(
      `${environment.support_system_prefix}/joinIncognitoMode`,
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

  requestOnGoingCalls(payload): Observable<any> {
    return this.http.post(
      `${environment.support_system_prefix}/onGoingCalls`,
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

  getQueueRequest(postParams: any): Observable<any> {
    return this.http.post(
      `${environment.support_system_prefix}/getRequestsQueue`,
      postParams
    );
  }

  getUserList() {
    return this.http.get(`${environment.auth_prefix}/getUserList`);
  }

  logoutUserByAdmin(postParams: any): Observable<any> {
    return this.http.post(`${environment.auth_prefix}/logoutUser`, postParams);
  }

  startRecording(payload) {
    return this.http.post(
      `${environment.support_system_prefix}/startRecording`,
      payload
    );
  }

  getAuditByUser(postParams: any): Observable<any> {
    return this.http.post(`${environment.auth_prefix}/auditLogs`, postParams);
  }

  getScheduledMeetings() {
    return this.http.get(`${environment.support_system_prefix}/listSchedules`);
  }
}
