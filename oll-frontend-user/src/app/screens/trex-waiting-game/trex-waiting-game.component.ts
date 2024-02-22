import {
  AfterViewInit,
  Component,
  HostListener,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import '../../../assets/js/dino.js';
import { NavigationExtras, Router } from '@angular/router';
import { ConfirmationModalComponent } from 'src/app/modules/shared/modal/confirmation-modal/confirmation-modal.component';
import { WebsocketService } from 'src/app/modules/shared/services/websocket.service';
import Swal from 'sweetalert2';
import { Subscription, of, switchMap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { CustomerSupportModalService } from 'src/app/modules/shared/modal/customer-support-modal/services/customer-support-modal.service';
import { TrexGameService } from 'src/app/screens/trex-waiting-game/services/trex-game.service.js';

declare var Runner: any;

@Component({
  selector: 'app-trex-waiting-game',
  templateUrl: './trex-waiting-game.component.html',
  styleUrls: ['./trex-waiting-game.component.scss'],
})
export class TrexWaitingGameComponent
  implements OnInit, AfterViewInit, OnDestroy
{
  remainingTime: number = environment.waiting_timer;
  requestDetails: any;
  interval;
  @ViewChild(ConfirmationModalComponent)
  confirmationModal?: ConfirmationModalComponent;
  joinsupportSubscription: Subscription;
  constructor(
    private router: Router,
    private websocketService: WebsocketService,
    // private trexGameService: TrexGameService,
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
  redirectionModalOpen: boolean = false;

  ngOnInit(): void {
    if (this.requestDetails) {
      this.startTimer();
      this.websocketService.emit(
        'lss_user_requests',
        this.requestDetails?.requestId
      );
      this.joinsupportSubscription = this.websocketService
        .listen('request_status')
        .pipe(
          switchMap((res: any) => {
            if (res) {
              const data = JSON.parse(res);
              if (data.meetingCode && data.status == 2) {
                return this.customerSupportService.joinUser({
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
    }
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      new Runner('.interstitial-wrapper');
    }, 100);
  }

  startTimer(): void {
    this.interval = setInterval(() => {
      if (this.remainingTime > 0) {
        this.remainingTime--;
      } else {
        clearInterval(this.interval);
        this.stop();
        this.showConfirmationDialog();
      }
    }, 1000);
  }

  openConfirmationModal(): void {
    if (this.confirmationModal) {
      this.confirmationModal.openModal(this.resetTimer.bind(this));
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
      if (result.isConfirmed) {
        Runner('.interstitial-wrapper').play();
        this.resetTimer();
      } else if (result.isDismissed) {
        let payload = {
          requestId: this.requestDetails?.requestId,
        };
        this.customerSupportService
          .deniedWaiting(payload)
          .subscribe((res: any) => {
            this.showRegretAlert();
          });
      }
    });
  }

  showRegretAlert() {
    Swal.fire({
      title: `Sorry to make you wait. All our lines are busy at the moment. Please try again in some time.`,
      // timer: 5000,
      // timerProgressBar: true,
      willClose: () => {
        this.router.navigate(['/home']).then(() => {
          location.reload();
        });
      },
      allowOutsideClick: false,
      allowEscapeKey: false,
      didOpen: () => {
        const text = document.querySelector('.swal2-title');
        const confirmButton = document.querySelector('.swal2-confirm');

        if (confirmButton) {
          confirmButton.setAttribute(
            'style',
            'border-radius: 18px; width: 100px; background-color: #da2128; color: #fff; border:none; padding:8px 10px; margin-left: 10px;'
          );
          text.setAttribute(
            'style',
            'color: #000; margin: 0; display: flex; justify-content: center; align-items: center; font-size: 1.2rem;'
          );
        }
      },
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.dismiss === Swal.DismissReason.timer) {
        this.router.navigate(['/home']).then(() => {
          location.reload();
        });
      }
    });
  }

  resetTimer(): void {
    this.remainingTime = environment.waiting_timer;
    this.startTimer();
  }

  @HostListener('window:keydown', ['$event'])
  handleKeyDown(event: KeyboardEvent): void {
    if (event.key === ' ' || event.key === 'Spacebar') {
      event.preventDefault();
    }
  }

  stop() {
    Runner('.interstitial-wrapper').stop();
  }

  openRedirectionModal(): void {
    this.redirectionModalOpen = true;
  }

  ngOnDestroy(): void {
    if (this.interval) {
      clearInterval(this.interval);
    }

    if (this.joinsupportSubscription) {
      this.joinsupportSubscription.unsubscribe();
    }
  }
}
