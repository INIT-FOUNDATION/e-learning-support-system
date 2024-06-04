import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { NavigationExtras, Router } from '@angular/router';
import { ConfirmationModalComponent } from 'src/app/modules/shared/modal/confirmation-modal/confirmation-modal.component';
import { WebsocketService } from 'src/app/modules/shared/services/websocket.service';
import Swal from 'sweetalert2';
import { Subscription, of, switchMap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { CustomerSupportModalService } from 'src/app/modules/shared/modal/customer-support-modal/services/customer-support-modal.service';
import { SupportMeetingService } from '../support-meeting/services/support-meeting.service';

declare var Runner: any;

@Component({
  selector: 'app-waiting-screen',
  templateUrl: './waiting-screen.component.html',
  styleUrls: ['./waiting-screen.component.scss'],
})
export class WaitingScreenComponent
  implements OnInit, OnDestroy, AfterViewInit
{
  remainingTime: number = environment.waiting_timer;
  @ViewChild(ConfirmationModalComponent)
  confirmationModal?: ConfirmationModalComponent;
  redirectionModalOpen: boolean = false;
  requestDetails: any;
  interval;
  requestAccepted = false;
  joinsupportSubscription: Subscription;

  @ViewChild('videoElement') videoElement: ElementRef;
  video: HTMLVideoElement;
  stream: MediaStream;
  micEnabled: boolean = true;
  videoEnabled: boolean = true;
  displayPreviewScreen: boolean = false;

  constructor(
    private websocketService: WebsocketService,
    private router: Router,
    private dialog: MatDialog,
    private supportMeetingService: SupportMeetingService,
    private customerSupportService: CustomerSupportModalService
  ) {
    const navigation = this.router.getCurrentNavigation();
    const state: any = navigation.extras.state;
    if (state) {
      this.requestDetails = state;
    } else {
      this.router.navigate(['/']);
      return;
    }
  }

  ngOnInit(): void {
    this.websocketService.disconnect();
    this.supportMeetingService.requestAccepted$.subscribe((res) => {
      this.requestAccepted = res;
    });
    if (this.requestDetails) {
      this.websocketService.connect();
      this.startTimer();
      this.joinsupportSubscription = this.websocketService
        .listen('request_status')
        .pipe(
          switchMap((res: any) => {
            if (res) {
              const data = JSON.parse(res);
              if (
                data.meetingCode &&
                data.status == 2 &&
                this.requestDetails.requestId == data.requestId
              ) {
                Swal.close();
                // this.supportMeetingService.requestAcceptedSet = true;
                return this.supportMeetingService.joinUser({
                  requestId: this.requestDetails?.requestId,
                });
              }
            }
            return of(null);
          })
        )
        .subscribe((res: any) => {
          if (res) {
            const navigationExtras: NavigationExtras = {
              state: {
                ...res,
                requestId: this.requestDetails?.requestId,
                participant_name: `${this.requestDetails?.requestedByUser}`,
                micButton: this.micEnabled,
                videoButton: this.videoEnabled,
                expertRequest: this.requestDetails?.expertRequest,
              },
            };
            this.websocketService.disconnect();
            this.router.navigate(['/support'], navigationExtras);
          }
        });

      this.websocketService.listen('connect').subscribe((res) => {
        this.websocketService.emit(
          'lss_user_requests',
          this.requestDetails?.requestId
        );
      });

      this.websocketService.listen('disconnect').subscribe((res) => {
        // console.log('Websocket Disconnected');
      });
    }
  }

  ngAfterViewInit(): void {
    this.startVideo();
    setTimeout(() => {
      if (this.stream) {
        this.displayPreviewScreen = true;
        this.stream.getAudioTracks().forEach((track) => {
          track.enabled = !track.enabled;
          this.micEnabled = track.enabled;
        });
        this.stream.getVideoTracks().forEach((track) => {
          track.enabled = !track.enabled;
          this.videoEnabled = track.enabled;
          track.stop();
        });
      }
    }, 2500);
  }

  startVideo() {
    this.video = this.videoElement.nativeElement;
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream) => {
        this.stream = stream;
        this.video.srcObject = stream;
        this.video.play();
      })
      .catch((err) => {
        console.error('Error accessing the camera: ', err);
      });
  }

  async toggleMute() {
    if (!this.stream) {
      console.error('Stream not available.');
      return;
    }

    this.stream.getAudioTracks().forEach((track) => {
      track.enabled = !track.enabled;
      this.micEnabled = track.enabled;
    });
  }

  toggleVideo() {
    if (!this.stream) {
      console.error('Stream not available.');
      return;
    }

    this.stream.getVideoTracks().forEach((track) => {
      track.enabled = !track.enabled;
      this.videoEnabled = track.enabled;
      if (this.videoEnabled) {
        this.startVideo();
        this.toggleMute();
      } else {
        track.stop();
      }
    });
  }

  showConfirmationDialog() {
    Swal.fire({
      title: 'Do you want to continue waiting?',
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
      /* Read more about isConfirmed, isDenied below */
      if (!this.requestAccepted) {
        if (result.isConfirmed) {
          const navigationExtras: NavigationExtras = {
            state: {
              ...this.requestDetails,
            },
          };
          this.router.navigate(['/trex-game'], navigationExtras);
          // Runner('.interstitial-wrapper').play();
          // this.resetTimer();
          if (this.interval) {
            clearInterval(this.interval);
          }
        } else if (result.isDismissed) {
          let payload = {
            requestId: this.requestDetails?.requestId,
          };
          this.customerSupportService
            .deniedWaiting(payload)
            .subscribe((res: any) => {
              this.router.navigate(['/']).then(() => {
                location.reload();
              });
            });
        }
      }
    });
  }

  startTimer(): void {
    this.interval = setInterval(async () => {
      if (this.remainingTime > 0) {
        this.remainingTime--;
      } else {
        clearInterval(this.interval);
        if (!this.requestAccepted) {
          // this.showConfirmationDialog();
          this.showTimerModal();
        }
      }
    }, 1000);
  }

  showTimerModal() {
    Swal.fire({
      title:
        'All customer support executives are currently occupied. Please request again later.',
      showCancelButton: false,
      confirmButtonText: 'Okay',
      confirmButtonColor: '#da2128',
      reverseButtons: true,
      buttonsStyling: false,
      allowOutsideClick: false,
      allowEscapeKey: false,
      didOpen: () => {
        const text = document.querySelector('.swal2-title');
        const btnContainer = document.querySelector('.swal2-actions');
        const confirmButton = document.querySelector('.swal2-confirm');

        if (confirmButton) {
          btnContainer.setAttribute('style', 'margin-bottom: 10px;'),
            confirmButton.setAttribute(
              'style',
              'border-radius: 18px; width: 100px; background-color: #da2128; color: #fff; border:none; padding:8px 10px; margin-left: 20px;'
            );

          text.setAttribute(
            'style',
            'color: #000; margin: 10px 0; display: flex; justify-content: center; align-items: center'
          );
        }
      },
    }).then((result) => {
      if (!this.requestAccepted) {
        if (result.isConfirmed) {
          let payload = {
            requestId: this.requestDetails?.requestId,
          };
          this.customerSupportService
            .deniedWaiting(payload)
            .subscribe((res: any) => {
              this.router.navigate(['/']).then(() => {
                location.reload();
              });
            });
        }
      }
    });
  }

  openConfirmationModal(): void {
    if (this.confirmationModal) {
      this.confirmationModal.openModal(this.resetTimer.bind(this));
    }
  }

  resetTimer(): void {
    this.remainingTime = environment.waiting_timer;
    this.startTimer();
  }

  openRedirectionModal(): void {
    this.redirectionModalOpen = true;
  }

  ngOnDestroy(): void {
    // this.websocketService.disconnect();
    if (this.interval) {
      clearInterval(this.interval);
    }
    Swal.close();
    if (this.joinsupportSubscription) {
      this.joinsupportSubscription.unsubscribe();
    }
  }
}
