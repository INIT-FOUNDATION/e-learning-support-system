import { Location, LocationStrategy } from '@angular/common';
import { AfterViewInit, Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { DataService } from 'src/app/modules/shared/services/data.service';
import { UtilityService } from 'src/app/modules/shared/services/utility.service';
import { environment } from 'src/environments/environment';
import { SupportMeetingService } from './services/support-meeting.service';
import Swal from 'sweetalert2';


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
  isAudioMuted = false;
  isVideoMuted = false;
  requestId: string;
  selectedRating: number;

  constructor(
    private router: Router,
    private _location: Location,
    public dataService: DataService,
    public utilityService: UtilityService,
    private dialog: MatDialog,
    private location: LocationStrategy,
    private supportMeetingService: SupportMeetingService,
    private route: ActivatedRoute
  ) {
    this.utilityService.showHeaderSet = false;
    this.utilityService.showFooterSet = false;
    const navigation = this.router.getCurrentNavigation();
    const state: any = navigation.extras.state;
    if (state) {
      this.meetingLink = state.backend_server_url;
      this.meeting_details = state;
    } else {
      this.meetingCode = this.route.snapshot.params['meetingCode'];
      if (!this.meetingCode) {
        this.router.navigate(['/home']);
      }

      return;
    }

    // this.meetingLink = 'jitsi.aieze.ai'
    // this.meeting_details = {
    //   jwt: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjb250ZXh0Ijp7InVzZXIiOnsiYXZhdGFyIjoiaHR0cHM6Ly9saW5rLXByb2QuYmxyMS5kaWdpdGFsb2NlYW5zcGFjZXMuY29tL2xpbmstdXNlcnMvcHJvZmlsZS1waWN0dXJlcy8yNDEyMjAyMzEzMzkzNi5qcGVnIiwibmFtZSI6IlN1ZGhpcmt1bWFycmFvIEFsbGFkYSIsImVtYWlsIjoiIiwiaWQiOiJlYTJjY2NiMi01YTE5LTRlNDAtODRiNC1kMzUzZWVlZWM1MGYifX0sImlzcyI6IkFJRVpFIiwic3ViIjoiVTBBWlFZIiwicm9vbSI6IlUwQVpRWSIsIm1vZGVyYXRvciI6dHJ1ZSwiYXVkIjoiKiIsImV4cCI6MTcwODMzNjAyOCwibmJmIjoxNzA4MjQ2MDI4LCJpYXQiOjE3MDgyNDk2Mjh9.5QCIlZSbK3BqldmDeo524cbUEfgjAbrx8nomFyT8JiA"      ,
    //   meeting_code: 'U0AZQY',
    //   participant_name: 'Sudhirkumarrao Allada(OLL)',
    //   requestId: ''
    // }

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
      const value: any = await this.supportMeetingService
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
      'desktop'
    ];
    // if (this.auth.currentUserValue?.token) {
    //   toolbarButtons.push('recording');
    //   toolbarButtons.push('invite');
    // }
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
        readOnlyName: false,
        enableUserRolesBasedOnToken: true,
        enableFeaturesBasedOnToken: true,
        toolbarButtons: toolbarButtons,
        buttonsWithNotifyClick: ['__end'],
        hideEmailInSettings: true,
        hideLobbyButton: false,
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

    // if (this.meeting_details.featureDetails.includes('recording')) {
    //   this.options.configOverwrite['localRecording'] = {
    //     disable: false,
    //     notifyAllParticipants: true,
    //   };
    // }

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
    this.router.navigate(['/home']);
    const starsHtml = `
    <div class="rating">
      <span class="star" id="star1"><i class="fa fa-star"></i></span>
      <span class="star" id="star2"><i class="fa fa-star"></i></span>
      <span class="star" id="star3"><i class="fa fa-star"></i></span>
      <span class="star" id="star4"><i class="fa fa-star"></i></span>
      <span class="star" id="star5"><i class="fa fa-star"></i></span>
    </div>`;

  Swal.fire({
    title: "Thank you for connecting. We hope it was helpful for you. Your feedback is valuable to us.",
    html:`${starsHtml}<input id="swal-input" class="swal2-input" placeholder="Enter your feedback" type="text">`,
    showCancelButton: true,
    confirmButtonText: "Submit",
    confirmButtonColor: '#da2128',
    showLoaderOnConfirm: true,
    allowOutsideClick: false,
    allowEscapeKey: false,
    didRender: () => {
      const confirmButton = document.querySelector('.swal2-confirm') as HTMLButtonElement;
      const feedbackInput = document.getElementById('swal-input') as HTMLInputElement;

      confirmButton.disabled = true;

      feedbackInput.addEventListener('input', () => {
        confirmButton.disabled = !(feedbackInput.value != '' && this.selectedRating);
      });
    },
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

        const confirmButtonElement = document.querySelector('.swal2-confirm') as HTMLButtonElement;
        confirmButtonElement.disabled = true; 

        document.getElementById('star1').addEventListener('click', () => this.countStar(1));
        document.getElementById('star2').addEventListener('click', () => this.countStar(2));
        document.getElementById('star3').addEventListener('click', () => this.countStar(3));
        document.getElementById('star4').addEventListener('click', () => this.countStar(4));
        document.getElementById('star5').addEventListener('click', () => this.countStar(5));
      }
    },
  }).then((result) => {
    if (result.isConfirmed) {
      let feedbackText = (document.getElementById('swal-input') as HTMLInputElement).value;
      let rating = this.selectedRating;
      if (feedbackText === '') {
        Swal.showValidationMessage('Feedback is required');
      } else {
        let payload = {
          requestId: "this.meeting_details.requestId",
          feedback: feedbackText,
          ratings: rating
        };

        this.supportMeetingService
          .userFeedback(payload)
          .subscribe((res: any) => {
            console.log(res)
            if(res){
              this.utilityService.showSuccessMessage(
                'User Created Successfully!'
              );
            }
          });
      }
    }
  });
  };

  countStar(star) {
    this.selectedRating = star;
    const stars = document.querySelectorAll('.star i');
    stars.forEach(starIcon => (starIcon.parentNode as HTMLElement).style.color = '');
  
    for (let i = 1; i <= star; i++) {
      const starElement = document.getElementById(`star${i}`);
      if (starElement) {
        const starIcon = starElement.querySelector('i');
        if (starIcon) {
          (starIcon.parentNode as HTMLElement).style.color = 'gold';
        }
      }
    }
  
    const feedbackInput = (document.getElementById('swal-input') as HTMLInputElement).value;
    const confirmButton = document.querySelector('.swal2-confirm') as HTMLButtonElement;
    confirmButton.disabled = !(feedbackInput != '' && this.selectedRating);
  }

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
  };

  handleVideoConferenceJoined = async (participant) => {
    this.api.executeCommand('toggleTileView');
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
      this.isAudioMuted = !this.isAudioMuted;
    }

    if (command == 'toggleVideo') {
      this.isVideoMuted = !this.isVideoMuted;
    }
  }

  ngOnDestroy(): void {
    window.removeEventListener('beforeunload', this.beforeUnload, true);
    this.closeRequestAndRoute();
  }
}
