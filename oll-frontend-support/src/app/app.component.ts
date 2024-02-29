import { Component, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { AuthService } from './screens/auth/services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AppPreferencesService } from './modules/shared/services/app-preferences.service';
import { DataService } from './modules/shared/services/data.service';
import { Location } from '@angular/common';
import { UtilityService } from './modules/shared/services/utility.service';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'lss-frontend-admin';
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
}
