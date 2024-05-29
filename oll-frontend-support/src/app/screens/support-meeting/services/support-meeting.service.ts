import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class SupportMeetingService {
  constructor(private http: HttpClient) {}

  createIssueLogin(postParams: any): Observable<any> {
    return this.http.post(
      `${environment.support_system_prefix}/issueLog`,
      postParams
    );
  }

  getCourseList() {
    return this.http.get(`${environment.auth_prefix}/getCategoryList`);
  }

  getEducationalQualification() {
    return this.http.get(
      `${environment.auth_prefix}/educationalQualificationList`
    );
  }

  getPreferredLanguages() {
    return this.http.get(`${environment.auth_prefix}/preferredLanguages`);
  }

  getExpertsList(expert_id: any) {
    return this.http.get(
      `${environment.auth_prefix}/getAvailableExperts/${expert_id}`
    );
  }

  getUserByMobileNumber(mobile_number: number) {
    return this.http.get(
      `${environment.auth_prefix}/getGuestUser/${mobile_number}`
    );
  }

  getRequestByGuest(payload) {
    return this.http.get(
      `${environment.support_system_prefix}/getRequestHistoryByGuestUsers/${payload.guestUserId}/${payload.categoryId}`
    );
  }

  addSolution(postParams: any): Observable<any> {
    return this.http.post(
      `${environment.support_system_prefix}/addSolutionToRequest`,
      postParams
    );
  }
}
