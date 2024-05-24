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
}
