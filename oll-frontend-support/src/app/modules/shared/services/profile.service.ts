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

  // updateProfile(postParams: any): Observable<any> {
  //   return this.http.post(
  //     `${environment.client_prefix}/updateProfileDetails`,
  //     postParams
  //   );
  // }

  // uploadProfilePic(payload) {
  //   return this.http.post(
  //     `${environment.auth_prefix}/uploadProfilePic`,
  //     payload
  //   );
  // }

  uploadProfilePic(payload) {
    return this.http.post(
      `${environment.auth_prefix}/userProfilePicUpload`,
      payload
    );
  }
}
