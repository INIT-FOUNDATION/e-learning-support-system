import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { DataService } from 'src/app/modules/shared/services/data.service';
import { DashboardService } from './services/dashboard.service';
import { AuthService } from '../auth/services/auth.service';
import { WebsocketService } from 'src/app/modules/shared/services/websocket.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class DashboardComponent implements OnInit {
  supportUserid: any = '';
  supportRoleid: any = '';
  supportUserName: any = 'Admin Dashboard';
  is_admin: boolean = false;
  roleName: any;
  viewType = 'support';
  constructor(
    public dataService: DataService,
    private dashboardService: DashboardService,
    private authService: AuthService
  ) {}

  getSupportUserDetails(userData: {
    userId: string;
    roleId: string;
    userName: string;
  }) {
    this.supportUserName = userData?.userName;
    this.supportUserid = userData.userId;
    this.supportRoleid = userData.roleId;
    this.viewType = 'support';
  }
  toggleStatus: boolean = true;
  toggleChangeView: boolean = false;
  supportStatus: any = 1;
  ngOnInit(): void {
    if (this.authService.currentUserValue?.token) {
      const userDetails = this.dataService.userDetails;
      if (userDetails.is_admin_user) {
        this.is_admin = true;
        this.roleName = userDetails.role_name;
        this.viewType = 'admin';
      } else {
        this.viewType = 'support';
      }
    }
  }

  changeLoginStatus() {
    this.supportStatus = this.toggleStatus ? 1 : 0;
    this.dashboardService
      .updateLoginStatus({ availability_status: this.supportStatus })
      .subscribe((res: any) => {});
  }

  goBack(event) {
    this.supportUserName = 'Admin Dashboard';
    this.toggleChangeView = event;
    this.changeView();
  }

  changeView() {
    if (this.toggleChangeView) {
      this.viewType = 'admin';
    } else {
      this.viewType = 'support';
    }
  }
}
