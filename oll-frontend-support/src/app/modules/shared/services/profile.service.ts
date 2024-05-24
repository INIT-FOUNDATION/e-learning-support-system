import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ProfileService {
  constructor(private http: HttpClient) {}

  updateProfile(payload) {
    return this.http.post(
      `${environment.auth_prefix}/userUpdateDetails`,
      payload
    );
  }

  uploadProfilePic(payload) {
    return this.http.post(
      `${environment.auth_prefix}/userProfilePicUpload`,
      payload
    );
  }

  getCourseList() {
    return this.http.get(`${environment.auth_prefix}/getCategoryList`);
  }

  updateExpertCategory(payload) {
    return this.http.post(
      `${environment.auth_prefix}/addExpertCategoryMappings`,
      payload
    );
  }
}
