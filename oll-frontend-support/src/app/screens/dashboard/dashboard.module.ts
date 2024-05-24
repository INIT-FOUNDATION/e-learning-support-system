import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './dashboard.component';
import { SharedModule } from 'src/app/modules/shared/shared.module';
import { PopoverModule } from 'ngx-bootstrap/popover';
import { SupportDashboardComponent } from './component/support-dashboard/support-dashboard.component';
import { AdminDashboardComponent } from './component/admin-dashboard/admin-dashboard.component';
import { ExpertDashboardComponent } from './component/expert-dashboard/expert-dashboard.component';

@NgModule({
  declarations: [DashboardComponent, SupportDashboardComponent, AdminDashboardComponent, ExpertDashboardComponent],
  imports: [CommonModule, DashboardRoutingModule, SharedModule, PopoverModule],
})
export class DashboardModule {}
