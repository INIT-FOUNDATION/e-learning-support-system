import { Component, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { AuthService } from './screens/auth/services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AppPreferencesService } from './modules/shared/services/app-preferences.service';
import { DataService } from './modules/shared/services/data.service';
import { Location } from '@angular/common';
import { UtilityService } from './modules/shared/services/utility.service';
import { debounceTime, fromEvent, merge, of, tap } from 'rxjs';
import { environment } from 'src/environments/environment';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'lss-frontend-admin';
  inactiveTime = environment.session_inactive_time
  constructor(
    private authService: AuthService,
    private router: Router,
    private appPreferences: AppPreferencesService,
    private dataService: DataService,
    private location: Location,
    public utilityService: UtilityService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.authService.currentUser.subscribe(async (r) => {
      if (r && r.token) {
        // this.trackInactivityOfUser();
        let userDetails: any = await this.authService
          .getUserDetails()
          .toPromise();
        this.appPreferences.setValue(
          'oll_user_details',
          JSON.stringify(userDetails.data)
        );
        this.dataService.userDetails = userDetails.data;
        let url = this.location.path();
        if (r.redirect) {
          if (url.indexOf('login') != -1) {
            this.router.navigate(['/dashboard']);
          }
        }
      } else {
        let url = this.location.path();

        let allowedUrlsBeforeLogin = [
          '/login',
          '/home',
          '/support',
          '/home/drseemanegi',
        ];

        if (allowedUrlsBeforeLogin.indexOf(url) != -1) {
          this.router.navigate([url]);
        } else {
          this.authService.setMeetingCode = url;
          this.router.navigate(['/login']);
        }
      }
    });
  }

  trackInactivityOfUser() {
    merge(
      fromEvent(window, 'mousemove'),
      fromEvent(window, 'keypress'),
      fromEvent(window, 'touchstart'),
      fromEvent(window, 'blur'), //when you switch browser tab
      of('load') //onload
    ).pipe(
        tap((event: any) => {
          console.log('Event triggered');
        }),
        debounceTime(this.inactiveTime),
        tap((event) => {
          console.log(`User Inactive:: ${this.inactiveTime} ms`);
        })
    ).subscribe();
  }
}
