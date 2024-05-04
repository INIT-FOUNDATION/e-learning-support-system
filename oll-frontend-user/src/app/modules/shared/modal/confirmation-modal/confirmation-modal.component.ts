import {
  Component,
  EventEmitter,
  Output,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { Router } from '@angular/router';
import { RedirectionModalComponent } from '../redirection-modal/redirection-modal.component';
declare var Runner: any;

@Component({
  selector: 'app-confirmation-modal',
  templateUrl: './confirmation-modal.component.html',
  styleUrls: ['./confirmation-modal.component.scss'],
})
export class ConfirmationModalComponent {
  @Output() openRedirectionModal: EventEmitter<void> = new EventEmitter<void>();
  showModal: boolean = false;
  confirmActionCallback: Function | undefined;
  @ViewChild('redirectionModal') redirectionModal!: ElementRef;

  constructor(private router: Router) {}

  openModal(callback: Function): void {
    this.confirmActionCallback = callback;
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
    setTimeout(() => {
      this.router.navigate(['/']).then(() => {
        location.reload();
      });
    }, 5000);
  }

  confirmAction() {
    if (this.confirmActionCallback) {
      this.router.navigate(['/trex-game']);
      Runner('.interstitial-wrapper').play();
      this.confirmActionCallback();
    }
    this.showModal = false;
  }
}
