import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class RegistrationService {
  constructor(private http: HttpClient) {}

  registerNewUser(postParams: any): Observable<any> {
    return this.http.post(`${environment.auth_prefix}/signUp`, postParams);
  }

  getRoles(): Observable<any> {
    return this.http.get(`${environment.auth_prefix}/listRoles`);
  }

  getCountryCodes(): Observable<any> {
    return this.http.get(`${environment.auth_prefix}/countryCodes`);
  }

  authenticateFace(postParams: any): Observable<any> {
    return this.http.post(
      `${environment.auth_prefix}/enableFaceAuth`,
      postParams
    );
  }
}
