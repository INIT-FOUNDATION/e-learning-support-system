import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { log } from '@tensorflow/tfjs-core';
import { BehaviorSubject, Observable } from 'rxjs';
import { AppPreferencesService } from 'src/app/modules/shared/services/app-preferences.service';
import { DataService } from 'src/app/modules/shared/services/data.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  public currentUserSubject: BehaviorSubject<any>;
  public currentUser: Observable<any | null>;
  userDetails: any = [];
  meetingCode: any;
  constructor(
    private appPreferences: AppPreferencesService,
    private http: HttpClient,
    private dataService: DataService,
    private router: Router
  ) {
    let token: any = this.appPreferences.getValue('user_token');

    this.currentUserSubject = new BehaviorSubject<any>({
      token: JSON.parse(token),
      redirect: true,
    });
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): any {
    return this.currentUserSubject.value;
  }

  validateUser(postParams: any): Observable<any> {
    return this.http.post(
      `${environment.auth_prefix}/validateUser`,
      postParams
    );
  }

  googleSignInValidator(postParams: any): Observable<any> {
    return this.http.post(
      `${environment.auth_prefix}/googleSignInValidator`,
      postParams
    );
  }

  signIn(postParams: any): Observable<any> {
    return this.http.post(`${environment.auth_prefix}/signIn`, postParams);
  }

  getUserDetails() {
    return this.http.get(`${environment.auth_prefix}/getUserDetails`);
  }

  loginUsingFace(postParams: any): Observable<any> {
    return this.http.post(
      `${environment.auth_prefix}/validateFaceAuth`,
      postParams
    );
  }

  logout() {
    let token: any = this.appPreferences.getValue('user_token');
    if (token) {
      const headers = new HttpHeaders();
      headers.set('Authorization', `${JSON.parse(token)}`);
      this.http.post(environment.auth_prefix + '/signOut', {}).subscribe();
      this.appPreferences.clearAll();
      this.dataService.userDetails = null;
      this.dataService.userData = null;
      this.currentUserSubject.next(null);
      this.router.navigate(['/login']);
      return false;
    } else {
      this.appPreferences.clearAll();
      this.dataService.userData = null;
      this.dataService.userDetails = null;
      this.currentUserSubject.next(null);
      this.router.navigate(['/login']);
      return false;
    }
  }

  set setMeetingCode(flag) {
    this.meetingCode = flag;
  }

  get getMeetingCode() {
    return this.meetingCode;
  }
}
