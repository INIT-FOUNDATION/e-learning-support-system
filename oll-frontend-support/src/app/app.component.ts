import {
  Component,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { AuthService } from './screens/auth/services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AppPreferencesService } from './modules/shared/services/app-preferences.service';
import { DataService } from './modules/shared/services/data.service';
import { Location } from '@angular/common';
import { UtilityService } from './modules/shared/services/utility.service';
import {
  Subscription,
  debounceTime,
  fromEvent,
  merge,
  of,
  switchMap,
  tap,
} from 'rxjs';
import { environment } from 'src/environments/environment';
import { DashboardService } from './screens/dashboard/services/dashboard.service';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'lss-frontend-admin';
  inactiveTime = environment.session_inactive_time;
  userInactivitySub$: Subscription;
  userCurrentStatus: any = 0;
  constructor(
    private authService: AuthService,
    private router: Router,
    private appPreferences: AppPreferencesService,
    private dataService: DataService,
    private location: Location,
    public utilityService: UtilityService,
    private route: ActivatedRoute,
    private dashboardService: DashboardService
  ) {}

  ngOnInit(): void {
    this.authService.currentUser.subscribe(async (r) => {
      if (r && r.token) {
        this.trackInactivityOfUser();
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
        if (this.userInactivitySub$) {
          this.userInactivitySub$.unsubscribe();
        }
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

  unsubscribeInactivity() {
    if (this.userInactivitySub$) {
      this.userInactivitySub$.unsubscribe();
    }
  }

  trackInactivityOfUser() {
    this.userInactivitySub$ = merge(
      fromEvent(window, 'mousemove'),
      fromEvent(window, 'keypress'),
      fromEvent(window, 'touchstart'),
      fromEvent(window, 'blur'), //when you switch browser tab
      of('load') //onload
    )
      .pipe(
        switchMap((event: any) => {
          if (this.authService.currentUserValue?.token) {
            if (this.userCurrentStatus != 1) {
              this.userCurrentStatus = 1;
              // return this.dashboardService.updateLoginStatus({
              //   availability_status: 1,
              // });
              return of(null);
            } else {
              return of(null);
            }
          } else {
            return of(null);
          }
        }),
        debounceTime(this.inactiveTime),
        switchMap((event) => {
          if (this.authService.currentUserValue?.token) {
            this.userCurrentStatus = 0;
            return this.dashboardService.updateLoginStatus({
              availability_status: 0,
            });
          } else {
            return of(null);
          }
        })
      )
      .subscribe();
  }

  ngOnDestroy(): void {
    this.unsubscribeInactivity();
  }
}
