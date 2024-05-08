import { Location, LocationStrategy } from '@angular/common';
import { AfterViewInit, Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { DataService } from 'src/app/modules/shared/services/data.service';
import { UtilityService } from 'src/app/modules/shared/services/utility.service';
import { AuthService } from '../auth/services/auth.service';
import { DashboardService } from '../dashboard/services/dashboard.service';
import { environment } from 'src/environments/environment';

declare var JitsiMeetExternalAPI: any;

@Component({
  selector: 'app-support-meeting',
  templateUrl: './support-meeting.component.html',
  styleUrls: ['./support-meeting.component.scss'],
})
export class SupportMeetingComponent implements OnInit, AfterViewInit {
  meetingLink;
  meeting_details;
  meeting_id;
  checkinterval;
  streamIsLive = false;
  flashNotSupported = false;
  player;
  userDetails;
  isDesktop;
  os;
  isAndroid;
  onLoadCalled = 0;

  room: any;
  options: any;
  api: any;
  user: any;
  meetingCode;
  // For Custom Controls
  onJoinIsAudioMuted = false;
  onJoinIsVideoMuted = false;

  constructor(
    private router: Router,
    private _location: Location,
    public dataService: DataService,
    public utilityService: UtilityService,
    private dialog: MatDialog,
    private auth: AuthService,
    private location: LocationStrategy,
    private dashboardService: DashboardService,
    private route: ActivatedRoute
  ) {
    this.utilityService.showHeaderSet = false;
    this.utilityService.showFooterSet = false;
    const navigation = this.router.getCurrentNavigation();
    const state: any = navigation.extras.state;
    if (state) {
      this.meetingLink = state.backend_server_url;
      // this.meetingLink = 'jitsi.aieze.ai';

      this.meeting_details = state;
    } else {
      this.meetingCode = this.route.snapshot.params['meetingCode'];
      if (!this.meetingCode) {
        if (this.auth.currentUserValue?.token) {
          this.router.navigate(['/dashboard']);
        }
      }
      return;
    }

    window.addEventListener('beforeunload', this.beforeUnload, true);
  }

  beforeUnload(event) {
    event.preventDefault(); // for Firefox
    event.returnValue = ''; // for Chrome
    return '';
  }

  async ngOnInit() {
    this.userDetails = this.dataService.userDetails;

    history.pushState(null, null, window.location.href);
    this.location.onPopState(() => {
      history.pushState(null, null, window.location.href);
    });
  }

  async ngAfterViewInit() {
    if (this.meetingCode) {
      const value: any = await this.dashboardService
        .joinSupport({
          meetingCode: this.meetingCode,
        })
        .toPromise();

      this.meetingLink = value.backend_server_url;
      this.meeting_details = {
        ...value,
        participant_name: `${this.dataService?.userDetails?.first_name} ${this.dataService?.userDetails?.last_name}`,
      };
    }

    this.room = this.meeting_details?.meeting_code; // set your room name
    this.user = {
      name: this.meeting_details?.participant_name, // set your username
    };

    this.utilityService.showPaddingSet = false;
    const toolbarButtons = [
      'camera',
      'chat',
      'fullscreen',
      'hangup',
      'microphone',
      'raisehand',
      'tileview',
      'desktop',
    ];
    if (this.auth.currentUserValue?.token) {
      // toolbarButtons.push('recording');
      toolbarButtons.push('invite');
    }
    this.options = {
      roomName: this.room,
      height: 700,
      configOverwrite: {
        prejoinPageEnabled: false,
        prejoinConfig: {
          enabled: false,
          hideDisplayName: false,
        },
        inviteBaseUrl: `${environment.lss_web_url}/support`,
        endMeetingCallBackUrl: `${environment.support_system_prefix}/endMeeting/${this.room}`,
        readOnlyName: false,
        enableUserRolesBasedOnToken: true,
        enableFeaturesBasedOnToken: true,
        toolbarButtons: toolbarButtons,
        buttonsWithNotifyClick: ['__end'],
        hideEmailInSettings: true,
        hideLobbyButton: false,
        hiddenParticipantNames: [environment.inspection_bot]
      },
      interfaceConfigOverwrite: {
        ENABLE_DIAL_OUT: false,
        MOBILE_DOWNLOAD_LINK_IOS:
          'https://itunes.apple.com/us/app/aieze-link/id1668022173',
        MOBILE_DOWNLOAD_LINK_ANDROID:
          'https://play.google.com/store/apps/details?id=aieze.link.vc',
      },
      parentNode: document.querySelector('#jitsi-iframe'),
      jwt: this.meeting_details?.jwt,
      userInfo: {
        displayName: this.user?.name,
      },
    };

    this.options.configOverwrite['breakoutRooms'] = {
      hideAddRoomButton: true,
    };
    this.options.configOverwrite['liveStreaming'] = { enabled: false };

    this.options.configOverwrite['disablePolls'] = true;

    this.options.configOverwrite['securityUi'] = {
      disableLobbyPassword: true,
    };

    this.api = new JitsiMeetExternalAPI(this.meetingLink, this.options);

    this.api.addEventListeners({
      readyToClose: this.handleClose,
      participantLeft: this.handleParticipantLeft,
      participantJoined: this.handleParticipantJoined,
      videoConferenceJoined: this.handleVideoConferenceJoined,
      videoConferenceLeft: this.handleVideoConferenceLeft,
      audioMuteStatusChanged: this.handleMuteStatus,
      videoMuteStatusChanged: this.handleVideoStatus,
    });
  }

  closeRequestAndRoute = () => {
    if (this.auth.currentUserValue?.token && this.meeting_details.isMod) {
      if (this.meeting_details.requestId) {
        this.dashboardService
          .closeRequest({ requestId: this.meeting_details.requestId })
          .subscribe(
            (res) => {
              this.router.navigate(['/dashboard']);
            },
            (error) => {
              console.log(error);
              this.router.navigate(['/dashboard']);
            }
          );
      } else {
        this.router.navigate(['/dashboard']);
      }
    } else {
      this.router.navigate(['/dashboard']);
    }
  };

  handleClose = () => {
    this.utilityService.showPaddingSet = true;
    this.utilityService.showHeaderSet = true;
    this.utilityService.showFooterSet = true;
    // this.closeRequestAndRoute();
  };

  handleParticipantLeft = async (participant) => {
    const data = await this.getParticipants();
    // this.closeRequestAndRoute();
  };

  handleParticipantJoined = async (participant) => {
    const data = await this.getParticipants();
    this.api.executeCommand('toggleTileView');
  };

  handleVideoConferenceJoined = async (participant) => {
    this.dashboardService.startRecording({meetingCode: this.room}).subscribe((res) => {console.log(res);});
    let data: any = await this.getParticipants();
  };

  addBreakoutRoom(name) {
    this.api.executeCommand('addBreakoutRoom', name);
  }

  handleVideoConferenceLeft = () => {
    this.closeRequestAndRoute();
  };

  handleMuteStatus = (audio) => {
    // console.log('handleMuteStatus', audio); // { muted: true }
  };

  handleVideoStatus = (video) => {
    // console.log('handleVideoStatus', video); // { muted: true }
  };

  getParticipants() {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve(this.api.getParticipantsInfo()); // get all participants
      }, 500);
    });
  }

  // custom events
  executeCommand(command: string) {
    this.api.executeCommand(command);

    if (command == 'toggleAudio') {
      this.onJoinIsAudioMuted = !this.onJoinIsAudioMuted;
    }

    if (command == 'toggleVideo') {
      this.onJoinIsVideoMuted = !this.onJoinIsVideoMuted;
    }
  }

  ngOnDestroy(): void {
    window.removeEventListener('beforeunload', this.beforeUnload, true);
  }
}
