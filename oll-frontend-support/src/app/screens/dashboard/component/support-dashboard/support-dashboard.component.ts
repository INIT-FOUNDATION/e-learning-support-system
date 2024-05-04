import {
  Component,
  ElementRef,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { DataService } from 'src/app/modules/shared/services/data.service';
import { DashboardService } from '../../services/dashboard.service';
import { AppPreferencesService } from 'src/app/modules/shared/services/app-preferences.service';
import { WebsocketService } from 'src/app/modules/shared/services/websocket.service';
import { NavigationExtras, Router } from '@angular/router';
import { UtilityService } from 'src/app/modules/shared/services/utility.service';
import { NotificationService } from 'src/app/modules/shared/services/notification.service';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from 'src/app/screens/auth/services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import * as moment from 'moment';
import { RecordingModalComponent } from 'src/app/modules/shared/modal/recording-modal/recording-modal.component';
import { MatSelectChange } from '@angular/material/select';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-support-dashboard',
  templateUrl: './support-dashboard.component.html',
  styleUrls: ['./support-dashboard.component.scss'],
})
export class SupportDashboardComponent implements OnInit, OnChanges, OnDestroy {
  userDetails: any = [];
  is_admin: boolean = false;
  roleName: any;
  callQueueWaitingList: any = [];
  hideMatLabel: boolean = false;
  expertUsersData: any = {
    activeCount: 0,
    totalCount: 0,
    users: [],
  };
  supportUsersData: any = {
    activeCount: 0,
    totalCount: 0,
    users: [],
  };
  callHistoryList: any = [];
  deviceInfo: any;
  onInit = true;
  toggleStatus: boolean = true;
  toggleChangeView: boolean = false;
  supportStatus: any = 1;
  previousQueueWaitingList = [];
  viewType = 'support';

  @Input() userId: string;
  @Input() roleId: string;

  @ViewChild('popover') popover: ElementRef;

  loginStatus: any = [
    { label: 'Offline', availability_status: 0 },
    { label: 'Online', availability_status: 1 },
    // { label: 'Away', availability_status: 2 },
    // { label: 'Do Not Disturb', availability_status: 3 },
    // { label: 'In Meeting', availability_status: 4 },
  ];

  availabilityStatus = this.loginStatus[1];
  selectedMeetingFilter = 1;
  currentPage = 1;
  pageSize = 5;
  scrollReachedBottom = false;
  requestsHistoryCount: number = 0;
  expertsCountData: number = 0;
  queueRequestData: any;
  subscription$: Subscription;
  constructor(public dataService: DataService,
    private dashboardService: DashboardService,
    private websocketService: WebsocketService,
    private appPreferences: AppPreferencesService,
    private router: Router,
    private utilityService: UtilityService,
    private notificationService: NotificationService,
    private el: ElementRef,
    private dialog: MatDialog,
    private authService: AuthService,
    private toastrService: ToastrService
  ) { }

  meetingHistoryFilter: any = [
    { id: 1, label: 'Today' },
    { id: 2, label: 'Yesterday' },
    { id: 3, label: 'Last 15 days' },
    { id: 4, label: 'Last 30 days' },
    { id: 5, label: 'All' },
  ];

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['userId'].currentValue) {
      if (changes['userId'].currentValue !== changes['userId'].previousValue) {
        this.callHistoryList = [];
        this.websocketService.disconnect();
        // this.queueRequest(changes['userId'].currentValue);
        // this.meetingHistory(changes['userId'].currentValue);
      }
    }
  }

  ngOnInit(): void {
    if (this.authService.currentUserValue?.token) {
      const userDetails = this.dataService.userDetails;
      if (userDetails.is_admin_user) {
        this.is_admin = true;
        this.roleName = userDetails.role_name;
        this.viewType = 'admin';
      } else {
        this.is_admin = false;
        this.viewType = 'support';
        this.userId = userDetails?.user_id;
      }
    }
    this.utilityService.showHeaderSet = true;
    this.utilityService.showFooterSet = true;
    this.notificationService.requestPermission();
    const userToken = this.appPreferences.getValue('user_token');
    this.userDetails = this.dataService.userDetails;
    // this.websocketService.emit('lss_support_availability', JSON.parse(userToken));
    const establishWebsocketConnection = this.is_admin ? ((this.userId && this.roleId) ? true : false) : true;
    if (establishWebsocketConnection) {
      this.websocketService.connect();
      this.websocketService.listen('lss_user_availability_status').subscribe((res: any) => {
          if (res) {
            this.availabilityStatus = this.loginStatus.find((it) => it.availability_status == res.availability_status);
            this.toggleStatus = this.availabilityStatus.availability_status == 0 ? false : true;
          }
      });
      this.websocketService.listen('requests').subscribe((res: any) => {
        if (res && res.length > 0) {
          this.getOrganisedList(res);
          if (!this.onInit) {
            if (this.previousQueueWaitingList) {
              const newRequests = this.findArrayDifference(this.previousQueueWaitingList, this.callQueueWaitingList, 'requestId');
              if (newRequests && newRequests.length > 0) {
                const request = newRequests[newRequests.length - 1];
                this.notificationService.showNotification('New Support request',
                  {
                    body: `${request.requestedByUser} has placed a request`,
                    icon: 'https://link-prod.blr1.digitaloceanspaces.com/assets/images/oll-logo.png',
                    data: request,
                    silent: false,
                    // vibrate: 3,
                  }
                );
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


      let websocketPayload: any = { token: JSON.parse(userToken), type: 'cousellor' };
      if (this.is_admin) {
        websocketPayload = {
          ...websocketPayload,
          type: 'admin',
          counsellor_user_id: this.userId,
          counsellor_role_id: this.roleId
        }
      }

      this.websocketService.listen('connect').subscribe((res) => {
        this.websocketService.emit('lss_support_availability', JSON.stringify(websocketPayload));
      });

      this.websocketService.listen('disconnect').subscribe((res) => { });
    }

    this.meetingHistory(this.userId);
    this.changeLoginStatus();
    this.expertsCount();
    this.queueRequest(this.userId);
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

  playAudio(): void {
    const audio = new Audio('https://cklassrooms.innoida.utho.io/assets/audio/notification.wav');
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

  acceptRequest(requestDetails: any) {
    this.dashboardService.attendRequest({ requestId: requestDetails.requestId, userId: (this.is_admin ? this.userId : null) }).subscribe((res: any) => {
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

  playRecording(recordings) {
    if (recordings && recordings.length > 0) {
      const dialogRef = this.dialog.open(RecordingModalComponent, {
        width: '400px',
        data: { recordingUrl: recordings[0].recording_url },
      });

      dialogRef.afterClosed().subscribe((result) => {
        // console.log('The dialog was closed');
      });
    }
  }

  onScroll(event: any): void {
    this.scrollReachedBottom = this.isScrollbarAtBottom(event);
    if (this.scrollReachedBottom) {
      this.currentPage += 1;
      this.meetingHistory(this.userId);
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
    this.meetingHistory(this.userId);
  }

  changeLoginStatus() {
    this.supportStatus = this.toggleStatus ? 1 : 0;
    // this.hideMatLabel = true;
    this.dashboardService.updateLoginStatus({ availability_status: this.supportStatus }).subscribe((res: any) => { });
  }

  changeView(event) {
    if (event) {
      this.viewType = 'admin';
    } else {
      this.viewType = 'support';
    }
  }

  showLogOutConfirmation(userObj) {
    Swal.fire({
      title: `Are you sure you want to logout ${userObj.first_name} ${userObj.last_name}?`,
      showCancelButton: true,
      cancelButtonText: 'No',
      cancelButtonColor: '#fff',
      confirmButtonText: 'Yes',
      confirmButtonColor: '#da2128',
      reverseButtons: true,
      buttonsStyling: false,
      allowOutsideClick: false,
      allowEscapeKey: false,
      didOpen: () => {
        const text = document.querySelector('.swal2-title');
        const btnContainer = document.querySelector('.swal2-actions');
        const confirmButton = document.querySelector('.swal2-confirm');
        const cancelButton = document.querySelector('.swal2-cancel');

        if (confirmButton && cancelButton) {
          btnContainer.setAttribute('style', 'margin-bottom: 10px;'),
            confirmButton.setAttribute(
              'style',
              'border-radius: 18px; width: 100px; background-color: #da2128; color: #fff; border:none; padding:8px 10px; margin-left: 20px;'
            );
          cancelButton.setAttribute(
            'style',
            'border-radius: 18px; width: 100px; background-color: #fff; color: #da2128; border: 1px solid #da2128; padding:8px 10px;'
          );
          text.setAttribute(
            'style',
            'color: #000; margin: 10px 0; display: flex; justify-content: center; align-items: center'
          );
        }
      },
    }).then((result) => {
      if (result.isConfirmed) {
        this.logoffUser(userObj);
      }
    });
  }

  logoffUser(userDetails) {
    const payload: any = {
      user_id: userDetails?.user_id,
      user_name: userDetails?.user_name,
    };
    this.dashboardService.logoutUserByAdmin(payload).subscribe((res) => {
      if (res && res.message) {
        this.toastrService.success(res?.message);
      } else {
        this.toastrService.error('Something went wrong!');
      }
    });
  }

  ngOnDestroy(): void {
    this.websocketService.disconnect();
  }
}
