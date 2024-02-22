import { Component } from '@angular/core';

@Component({
  selector: 'app-no-customer-support-available',
  templateUrl: './no-customer-support-available.component.html',
  styleUrls: ['./no-customer-support-available.component.scss'],
})
export class NoCustomerSupportAvailableComponent {
  timeLeft: any;
  interval: any;

  constructor() {}

  ngOnInit(): void {
    this.interval = setInterval(() => {
      this.calculateTimeLeft();
    }, 1000);
  }

  ngOnDestroy(): void {
    clearInterval(this.interval);
  }

  calculateTimeLeft(): void {
    const now = new Date();
    const targetTime = new Date();
    targetTime.setHours(10, 0, 0);
    this.timeLeft = targetTime.getTime() - now.getTime();
  }

  msToTime(ms: number): string {
    const hours = Math.floor(ms / 3600000);
    return `${hours} `;
  }
}
