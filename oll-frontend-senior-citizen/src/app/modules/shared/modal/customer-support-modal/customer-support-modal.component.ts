import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { CustomerSupportModalService } from './services/customer-support-modal.service';

@Component({
  selector: 'app-customer-support-modal',
  templateUrl: './customer-support-modal.component.html',
  styleUrls: ['./customer-support-modal.component.scss'],
})
export class CustomerSupportModalComponent {
  constructor(
    private router: Router,
    private customerSupportService: CustomerSupportModalService
  ) {}
  @Input() userName: string | undefined;

  isMobile: boolean = false;

  ngOnInit(): void {
    this.detectDeviceType();
  }

  detectDeviceType(): void {
    this.isMobile = window.innerWidth <= 768;
  }

  connectWithSupportTeam() {
    const payload = {
      requestedByUser: this.userName,
      requestedUserDeviceInfo: this.isMobile ? 'Mobile' : 'Desktop',
    };

    try {
      this.customerSupportService
        .createRequest(payload)
        .subscribe((res: any) => {
          this.router.navigate(['/waiting']);
        });
    } catch (error) {
      console.log(error);
    }
  }
}
