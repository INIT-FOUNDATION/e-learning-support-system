import { Component } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import * as moment from 'moment';
import { CustomerSupportModalService } from 'src/app/modules/shared/modal/customer-support-modal/services/customer-support-modal.service';
import { UtilityService } from 'src/app/modules/shared/services/utility.service';
import { environment } from 'src/environments/environment';
import { SupportMeetingService } from '../support-meeting/services/support-meeting.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent {
  constructor(
    private router: Router,
    private customerSupportService: CustomerSupportModalService,
    private utilityService: UtilityService,
    private activeRoute: ActivatedRoute,
    private supportMeetingService: SupportMeetingService
  ) {}
  userName: string = '';
  isMobile: boolean = false;
  currentHour = new Date().getHours();
  idFound: boolean;
  rolesList: any;
  activeRouteId: any;
  ngOnInit(): void {
    this.utilityService.showHeaderSet = true;
    this.detectDeviceType();
    this.activeRouteId = this.activeRoute.snapshot.params['id'];
  }

  detectDeviceType(): void {
    this.isMobile = window.innerWidth <= 768;
  }

  connectWithSupportTeam() {
    const payload = {
      requestedByUser: this.userName
        ? this.userName
        : `Guest-${moment().format('HHmmssDDMMYY')}`,
      requestedUserDeviceInfo: this.isMobile ? 'Mobile' : 'Desktop',
      requestPurpose: this.activeRouteId ? this.activeRouteId : 'General',
    };

    try {
      this.customerSupportService
        .createRequest(payload)
        .subscribe((res: any) => {
          const requestData = res.data;
          const enable_no_support = environment.enable_no_support;
          const navigationExtras: NavigationExtras = {
            state: {
              ...requestData,
            },
          };
          if (this.currentHour >= 10 && this.currentHour < 21) {
            this.router.navigate(['/waiting'], navigationExtras);
          } else {
            if (enable_no_support) {
              this.router.navigate(['/no-support']);
            } else {
              this.router.navigate(['/waiting'], navigationExtras);
            }
          }
        });
    } catch (error) {
      console.log(error);
    }
  }
}
