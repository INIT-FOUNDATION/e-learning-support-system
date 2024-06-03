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

  getExpertsList(payload: any) {
    let url = `${environment.auth_prefix}/getAvailableUsers?roleId=${payload.roleId}`;
    if (payload.categoryId) {
      url += `&categoryId=${payload.categoryId}`;
    }
    return this.http.get(url);
  }

  getUserByMobileNumber(mobile_number: number) {
    return this.http.get(
      `${environment.auth_prefix}/getGuestUser/${mobile_number}`
    );
  }

  getRequestByGuest(payload) {
    let url = `${environment.support_system_prefix}/getRequestHistoryByGuestUser/?guestUserId=${payload.guestUserId}`;
    if (payload.categoryId) url += `&categoryId=${payload.categoryId}`;
    return this.http.get(url);
  }

  addSolution(postParams: any): Observable<any> {
    return this.http.post(
      `${environment.support_system_prefix}/addSolutionToRequest`,
      postParams
    );
  }
}
