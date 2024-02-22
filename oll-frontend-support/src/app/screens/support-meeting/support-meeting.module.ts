import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SupportMeetingRoutingModule } from './support-meeting-routing.module';
import { SupportMeetingComponent } from './support-meeting.component';
import { SharedModule } from 'src/app/modules/shared/shared.module';

@NgModule({
  declarations: [SupportMeetingComponent],
  imports: [CommonModule, SupportMeetingRoutingModule, SharedModule],
})
export class SupportMeetingModule {}
