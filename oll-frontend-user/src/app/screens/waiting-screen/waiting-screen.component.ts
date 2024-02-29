import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
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
export class WaitingScreenComponent implements OnInit, OnDestroy {
  remainingTime: number = environment.waiting_timer;
  @ViewChild(ConfirmationModalComponent)
  confirmationModal?: ConfirmationModalComponent;
  redirectionModalOpen: boolean = false;
  requestDetails: any;
  interval;
  requestAccepted = false;
  joinsupportSubscription: Subscription;
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
      this.router.navigate(['/home']);
      return;
    }
  }

  ngOnInit(): void {
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
              },
            };
            this.router.navigate(['/support'], navigationExtras);
          }
        });

      this.websocketService.listen('connect').subscribe(res => {
        console.log('Websocket Connected');
        this.websocketService.emit('lss_user_requests', this.requestDetails?.requestId);
      });
  
      this.websocketService.listen('disconnect').subscribe(res => {
        console.log('Websocket Disconnected');
      });
    }
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
              this.router.navigate(['/home']).then(() => {
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
          this.showConfirmationDialog();
        }
      }
    }, 1000);
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
