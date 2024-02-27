import {
  AfterViewInit,
  Component,
  ElementRef,
  HostListener,
  OnInit,
  ViewChild,
} from '@angular/core';
import { DataService } from 'src/app/modules/shared/services/data.service';
import { DashboardService } from './services/dashboard.service';
import { WebsocketService } from 'src/app/modules/shared/services/websocket.service';
import { AppPreferencesService } from 'src/app/modules/shared/services/app-preferences.service';
import * as moment from 'moment';
import { NavigationExtras, Router } from '@angular/router';
import { UtilityService } from 'src/app/modules/shared/services/utility.service';
import { NotificationService } from 'src/app/modules/shared/services/notification.service';
import { MatSelectChange } from '@angular/material/select';
import { MatDialog } from '@angular/material/dialog';
import { RecordingModalComponent } from 'src/app/modules/shared/modal/recording-modal/recording-modal.component';
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit, AfterViewInit {
  userDetails: any = [];

  constructor(
    public dataService: DataService,
    private dashboardService: DashboardService,
    private websocketService: WebsocketService,
    private appPreferences: AppPreferencesService,
    private router: Router,
    private utilityService: UtilityService,
    private notificationService: NotificationService,
    private el: ElementRef,
    private dialog: MatDialog
  ) { }

  hideMatLabel: boolean = false;
  callQueueWaitingList: any = [];

  callHistoryList: any = [];
  deviceInfo: any;
  onInit = true;
  previousQueueWaitingList = [];
  @ViewChild('popover') popover: ElementRef;

  loginStatus: any = [
    { label: 'Offline', availability_status: 0 },
    { label: 'Online', availability_status: 1 },
    { label: 'Away', availability_status: 2 },
    { label: 'Do Not Disturb', availability_status: 3 },
    { label: 'In Meeting', availability_status: 4 },
  ];

  availabilityStatus = this.loginStatus[1];
  selectedMeetingFilter = 1;
  currentPage = 1;
  pageSize = 5;
  scrollReachedBottom = false;
  ngOnInit(): void {
    this.utilityService.showHeaderSet = true;
    this.utilityService.showFooterSet = true;
    this.notificationService.requestPermission();
    const userToken = this.appPreferences.getValue('user_token');
    this.userDetails = this.dataService.userDetails;
    // this.websocketService.emit('lss_support_availability', JSON.parse(userToken));
    this.websocketService
      .listen('lss_user_availability_status')
      .subscribe((res: any) => {
        if (res) {
          this.availabilityStatus = this.loginStatus.find(
            (it) => it.availability_status == res.availability_status
          );
        }
      });
    this.websocketService.listen('requests').subscribe((res: any) => {
      if (res && res.length > 0) {
        this.callQueueWaitingList = [];
        const tempList = res;
        const organizedList = [];
        tempList.forEach((req) => {
          req = JSON.parse(req);
          let waitTime: any = moment().diff(req.requestedAt, 'minutes');
          if (waitTime > 60) {
            waitTime = `${moment().diff(req.requestedAt, 'hours')} Hour(s)`;
          } else if (waitTime == 0) {
            waitTime = `${moment().diff(req.requestedAt, 'seconds')} Second(s)`;
          } else {
            waitTime = `${waitTime} Minute(s)`;
          }
          req.wait_time = waitTime;
          req.wait_time_in_sec = moment().diff(req.requestedAt, 'seconds');
          organizedList.push(req);
        });
        organizedList.sort((a, b) => b.wait_time_in_sec - a.wait_time_in_sec);
        this.callQueueWaitingList = organizedList;

        if (!this.onInit) {
          if (this.previousQueueWaitingList) {
            const newRequests = this.findArrayDifference(
              this.previousQueueWaitingList,
              this.callQueueWaitingList,
              'requestId'
            );
            if (newRequests && newRequests.length > 0) {
              const request = newRequests[newRequests.length - 1];
              this.notificationService.showNotification('New Support request', {
                body: `${request.requestedByUser} has placed a request`,
                icon: 'https://link-prod.blr1.digitaloceanspaces.com/assets/images/oll-logo.png',
                data: request,
                silent: false,
                vibrate: 3,
              });
              this.playAudio();
              this.previousQueueWaitingList = this.callQueueWaitingList;
            }
          }
        } else {
          this.previousQueueWaitingList = this.callQueueWaitingList;
        }

        this.onInit = false;
      }
    });


    this.websocketService.listen('connect').subscribe(res => {
      console.log('Websocket Connected');
      this.websocketService.emit('lss_support_availability', JSON.parse(userToken));
    });

    this.websocketService.listen('disconnect').subscribe(res => {
      console.log('Websocket Disconnected');
    });
    this.meetingHistory();
  }

  playAudio(): void {
    const audio = new Audio(
      'https://link-prod.blr1.digitaloceanspaces.com/assets/audio/notification.wav'
    );
    audio.play();
  }

  findArrayDifference(array1, array2, key) {
    const map1 = new Map();
    const map2 = new Map();

    // Create a map for the first array
    array1.forEach((item) => map1.set(item[key], item));

    // Create a map for the second array
    array2.forEach((item) => map2.set(item[key], item));

    // Find items that are in array2 but not in array1
    const differenceArray2 = array2.filter((item) => !map1.has(item[key]));

    return differenceArray2;
  }

  ngAfterViewInit(): void {
  }

  meetingHistoryFilter: any = [
    { id: 1, label: 'Today' },
    { id: 2, label: 'Yesterday' },
    { id: 3, label: 'Last 15 days' },
    { id: 4, label: 'Last 30 days' },
    { id: 5, label: 'All' },
  ];

  changeLoginStatus(value: any) {
    this.hideMatLabel = true;
    this.dashboardService
      .updateLoginStatus({ availability_status: value })
      .subscribe((res: any) => { });
  }

  acceptRequest(requestDetails: any) {
    this.dashboardService
      .attendRequest({ requestId: requestDetails.requestId })
      .subscribe((res: any) => {
        this.utilityService.showPaddingSet = false;
        const navigationExtras: NavigationExtras = {
          state: {
            ...res,
            requestId: requestDetails.requestId,
            participant_name: `${this.userDetails?.first_name} ${this.userDetails?.last_name}`,
          },
        };
        this.router.navigate(['/support'], navigationExtras);
      });
  }

  meetingHistory() {
    const payload = {
      duration_type: this.selectedMeetingFilter,
      page_size: this.pageSize,
      current_page: this.currentPage,
    };

    this.dashboardService.requestHistory(payload).subscribe(
      (res: any) => {
        // res.requestsHistory = [
        //   {
        //     requestId: '08da5203-97f1-4ae0-a952-e02a8ecbb6d5',
        //     requestedByUser: 'GUEST | 195519022024',
        //     requestedAt: '2024-02-19T08:55:10.883Z',
        //     status: 5,
        //     requestAttendedBy: '21e8700b-3e14-4bec-b79f-25c80d95c5a0',
        //     averageResponseTime: null,
        //     requestAssignedTo: '21e8700b-3e14-4bec-b79f-25c80d95c5a0',
        //     requestAttendedAt: '2024-02-19T08:55:15.229Z',
        //     averageInCallTime: null,
        //     feedback: null,
        //     recordingUrl: null,
        //     requestedUserDeviceInfo:
        //       '{"uo-device-type":"desktop","uo-os":"Linux","uo-os-version":"unknown","uo-is-mobile":"false","uo-is-tablet":"false","uo-is-desktop":"true","uo-browser-version":"121.0.0.0","uo-browser":"Chrome"}',
        //     requestClosedAt: '2024-02-19T19:16:46.883Z',
        //     requestAssignedAt: '2024-02-19T08:55:10.915Z',
        //     meetingCode: 'WU860U',
        //   },
        //   {
        //     requestId: '08da5203-97f1-4ae0-a952-e02a8ecbb6d5',
        //     requestedByUser: 'GUEST | 195519022024',
        //     requestedAt: '2024-02-19T08:55:10.883Z',
        //     status: 5,
        //     requestAttendedBy: '21e8700b-3e14-4bec-b79f-25c80d95c5a0',
        //     averageResponseTime: null,
        //     requestAssignedTo: '21e8700b-3e14-4bec-b79f-25c80d95c5a0',
        //     requestAttendedAt: '2024-02-19T08:55:15.229Z',
        //     averageInCallTime: null,
        //     feedback: null,
        //     recordingUrl: null,
        //     requestedUserDeviceInfo:
        //       '{"uo-device-type":"desktop","uo-os":"Windows","uo-os-version":"unknown","uo-is-mobile":"false","uo-is-tablet":"false","uo-is-desktop":"true","uo-browser-version":"121.0.0.0","uo-browser":"Chrome"}',
        //     requestClosedAt: '2024-02-19T19:16:46.883Z',
        //     requestAssignedAt: '2024-02-19T08:55:10.915Z',
        //     meetingCode: 'WU860U',
        //   },
        //   {
        //     requestId: '08da5203-97f1-4ae0-a952-e02a8ecbb6d5',
        //     requestedByUser: 'GUEST | 195519022024',
        //     requestedAt: '2024-02-19T08:55:10.883Z',
        //     status: 5,
        //     requestAttendedBy: '21e8700b-3e14-4bec-b79f-25c80d95c5a0',
        //     averageResponseTime: null,
        //     requestAssignedTo: '21e8700b-3e14-4bec-b79f-25c80d95c5a0',
        //     requestAttendedAt: '2024-02-19T08:55:15.229Z',
        //     averageInCallTime: null,
        //     feedback: null,
        //     recordingUrl: null,
        //     requestedUserDeviceInfo:
        //       '{"uo-device-type":"desktop","uo-os":"Linux","uo-os-version":"unknown","uo-is-mobile":"false","uo-is-tablet":"false","uo-is-desktop":"true","uo-browser-version":"121.0.0.0","uo-browser":"Chrome"}',
        //     requestClosedAt: '2024-02-19T19:16:46.883Z',
        //     requestAssignedAt: '2024-02-19T08:55:10.915Z',
        //     meetingCode: 'WU860U',
        //   },
        // ];
        if (res && res.requestsHistory && res.requestsHistory.length) {
          res.requestsHistory.forEach((reqHistory) => {
            reqHistory.requestedUserDeviceInfo = JSON.parse(
              reqHistory.requestedUserDeviceInfo
            );
          });


          this.callHistoryList = [
            ...this.callHistoryList,
            ...res.requestsHistory,
          ];
        } else {
          if (this.currentPage != 1) {
            this.currentPage -= 1;
          }
        }
        this.resetScrollBottomLoader();
      },
      (err) => {
        this.resetScrollBottomLoader();
      }
    );
  }

  resetScrollBottomLoader() {
    setTimeout(() => {
      this.scrollReachedBottom = false;
    }, 500);
  }

  playRecording(recordingUrl) {
    const dialogRef = this.dialog.open(RecordingModalComponent, {
      width: '400px',
      data: { recordingUrl: recordingUrl },
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log('The dialog was closed');
    });
  }

  onScroll(event: any): void {
    this.scrollReachedBottom = this.isScrollbarAtBottom(event);
    if (this.scrollReachedBottom) {
      this.currentPage += 1;
      this.meetingHistory();
    }
  }

  private isScrollbarAtBottom(event): boolean {
    const { scrollHeight, scrollTop, clientHeight } = event.target;

    if (Math.abs(scrollHeight - clientHeight - scrollTop) < 1) {
      return true;
    }
    return false;
  }

  changeFilter(event: MatSelectChange) {
    this.selectedMeetingFilter = event.value;
    this.currentPage = 1;
    this.callHistoryList = [];
    this.meetingHistory();
  }
}
