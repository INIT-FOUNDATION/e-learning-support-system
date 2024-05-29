import { Component, OnInit } from '@angular/core';
import { MatSelectChange } from '@angular/material/select';
import { NavigationExtras, Router } from '@angular/router';
import * as moment from 'moment';
import { DataService } from 'src/app/modules/shared/services/data.service';
import { DashboardService } from '../../services/dashboard.service';
import { WebsocketService } from 'src/app/modules/shared/services/websocket.service';
import { AppPreferencesService } from 'src/app/modules/shared/services/app-preferences.service';
import { NotificationService } from 'src/app/modules/shared/services/notification.service';

@Component({
  selector: 'app-expert-dashboard',
  templateUrl: './expert-dashboard.component.html',
  styleUrls: ['./expert-dashboard.component.scss'],
})
export class ExpertDashboardComponent implements OnInit {
  callQueueWaitingList: any = [];
  onGoingcallWaitingList: any = [];
  scheduledCalls: any = [];
  meetingHistoryFilter: any = [
    { id: 1, label: 'Today' },
    { id: 2, label: 'Yesterday' },
    { id: 3, label: 'Last 15 days' },
    { id: 4, label: 'Last 30 days' },
    { id: 5, label: 'All' },
  ];
  callQueueFilter: any = [
    { id: 1, label: 'Call Queue' },
    { id: 2, label: 'On going Calls' },
    { id: 3, label: 'Scheduled Calls' },
  ];
  loginStatus: any = [
    { label: 'Offline', availability_status: 0 },
    { label: 'Online', availability_status: 1 },
  ];
  availabilityStatus = this.loginStatus[1];
  userDetails: any = [];
  callHistoryList: any = [];
  requestsHistoryCount: number = 0;
  scrollReachedBottom = false;
  selectedCallQueueFilter = 1;
  currentPage = 1;
  selectedMeetingFilter = 1;
  pageSize = 5;
  toggleStatus: boolean = true;
  toggleChangeView: boolean = false;
  supportStatus: any = 1;
  expertsCountData: number = 0;
  onInit = true;
  previousQueueWaitingList = [];
  constructor(
    public router: Router,
    public dataService: DataService,
    private websocketService: WebsocketService,
    private appPreferences: AppPreferencesService,
    private notificationService: NotificationService,
    private dashboardService: DashboardService
  ) {}

  ngOnInit(): void {
    this.notificationService.requestPermission();
    const userToken = this.appPreferences.getValue('user_token');
    this.userDetails = this.dataService.userDetails;
    this.websocketService.emit(
      'lss_support_availability',
      JSON.parse(userToken)
    );

    this.websocketService.connect();
    this.websocketService
      .listen('lss_user_availability_status')
      .subscribe((res: any) => {
        if (res) {
          this.availabilityStatus = this.loginStatus.find(
            (it) => it.availability_status == res.availability_status
          );
          this.toggleStatus =
            this.availabilityStatus.availability_status == 0 ? false : true;
        }
      });
    this.websocketService.listen('requests').subscribe((res: any) => {
      if (res && res.length > 0) {
        this.getOrganisedList(res);
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
                // vibrate: 3,
              });
              this.playAudio();
              this.previousQueueWaitingList = this.callQueueWaitingList;
            }
          }
        } else {
          this.previousQueueWaitingList = this.callQueueWaitingList;
        }

        this.onInit = false;
      } else {
        this.callQueueWaitingList = [];
      }
    });

    let websocketPayload: any = {
      token: JSON.parse(userToken),
      type: 'cousellor',
    };

    this.websocketService.listen('connect').subscribe((res) => {
      this.websocketService.emit(
        'lss_support_availability',
        JSON.stringify(websocketPayload)
      );
    });

    this.websocketService.listen('disconnect').subscribe((res) => {});

    this.meetingHistory(this.userDetails?.user_id);
    this.changeLoginStatus();
    this.expertsCount();
    this.queueRequest(this.userDetails?.user_id);
  }

  changeFilter(event) {
    // this.selectedMeetingFilter = event.value;
    // this.currentPage = 1;
    // this.callHistoryList = [];
    // this.meetingHistory(this.userId);
  }

  acceptRequest(requestDetails) {
    const navigationExtras: NavigationExtras = {
      state: {
        ...requestDetails,
        isSupportuser: false,
        backend_server_url: 'jitsi.orrizonte.in',
      },
    };
    this.router.navigate(['/support'], navigationExtras);

    this.dashboardService
      .attendRequest({
        requestId: requestDetails.requestId,
        userId: this.userDetails.user_id,
      })
      .subscribe((res: any) => {
        // this.utilityService.showPaddingSet = false;
        const navigationExtras: NavigationExtras = {
          state: {
            ...res,
            requestId: requestDetails.requestId,
            participant_name: `${this.userDetails?.first_name} ${this.userDetails?.last_name}`,
            requestDetails: requestDetails,
            isSupportuser: true,
          },
        };
        this.router.navigate(['/support'], navigationExtras);
      });
  }

  changeCallQueueFilter(event: MatSelectChange) {
    this.selectedCallQueueFilter = event.value;
    if (this.selectedCallQueueFilter == 1) {
      this.queueRequest(this.userDetails?.user_id);
    } else if (this.selectedCallQueueFilter == 2) {
      this.onGoingCalls(this.userDetails.user_id);
    } else if (this.selectedCallQueueFilter == 3) {
      this.getScheduledMeeting();
    }
  }

  getOrganisedList(res) {
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
      let found = organizedList.find((obj) => obj.requestId == req.requestId);
      if (!found) {
        organizedList.push(req);
      }
    });
    organizedList.sort((a, b) => b.wait_time_in_sec - a.wait_time_in_sec);
    this.callQueueWaitingList = organizedList;
  }

  onGoingCalls(user_id) {
    const payload = {
      userId: user_id,
    };
    this.dashboardService.requestOnGoingCalls(payload).subscribe((res: any) => {
      this.onGoingcallWaitingList = res;
    });
  }

  getScheduledMeeting() {
    this.dashboardService.getScheduledMeetings().subscribe((res: any) => {
      this.scheduledCalls = res?.schedules;
    });
  }

  meetingHistory(user_id) {
    const payload = {
      duration_type: this.selectedMeetingFilter,
      page_size: this.pageSize,
      current_page: this.currentPage,
      userId: user_id,
    };

    this.dashboardService.requestHistory(payload).subscribe(
      (res: any) => {
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

        this.requestsHistoryCount = res.requestsHistoryCount;
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

  changeLoginStatus() {
    this.supportStatus = this.toggleStatus ? 1 : 0;
    // this.hideMatLabel = true;
    this.dashboardService
      .updateLoginStatus({ availability_status: this.supportStatus })
      .subscribe((res: any) => {});
  }

  expertsCount() {
    this.dashboardService
      .expertsRoleCount()
      .toPromise()
      .then((data: any) => {
        this.expertsCountData = data.nonPrimaryRoleCount;
      })
      .catch((error) => {
        console.error('Error fetching experts role count:', error);
      });
  }

  queueRequest(user_id) {
    const payload: any = {
      user_id: user_id,
    };
    this.dashboardService
      .getQueueRequest(payload)
      .toPromise()
      .then((data: any) => {
        this.getOrganisedList(data.requestQueueData);
      })
      .catch((error) => {
        console.error('Error fetching experts role count:', error);
      });
  }

  playAudio(): void {
    const audio = new Audio(
      'https://cklassrooms.innoida.utho.io/assets/audio/notification.wav'
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
}
