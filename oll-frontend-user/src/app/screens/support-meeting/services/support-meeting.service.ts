import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class SupportMeetingService {
  private requestAccepted: BehaviorSubject<boolean>;
  requestAccepted$: Observable<boolean>;

  constructor(private http: HttpClient) {
    this.requestAccepted = new BehaviorSubject(false);
    this.requestAccepted$ = this.requestAccepted.asObservable();
  }

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

  userFeedback(postParams: any): Observable<any> {
    return this.http.post(
      `${environment.support_system_prefix}/addFeedback`,
      postParams
    );
  }

  getRoles(): Observable<any> {
    return this.http.get(`${environment.auth_prefix}/listRoles`);
  }

  set requestAcceptedSet(flag) {
    this.requestAccepted.next(flag);
  }

  getExpertsDetailsForFeedback(expertId) {
    return this.http.get(
      `${environment.auth_prefix}/getUserByRequestId/${expertId}`
    );
  }
}
