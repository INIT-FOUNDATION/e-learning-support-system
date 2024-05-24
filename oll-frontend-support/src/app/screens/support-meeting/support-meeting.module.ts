import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SupportMeetingRoutingModule } from './support-meeting-routing.module';
import { SupportMeetingComponent } from './support-meeting.component';
import { SharedModule } from 'src/app/modules/shared/shared.module';
import { ExpertFormComponent } from './components/expert-form/expert-form.component';
import { CounselorFormComponent } from './components/counselor-form/counselor-form.component';

@NgModule({
  declarations: [SupportMeetingComponent, ExpertFormComponent, CounselorFormComponent],
  imports: [CommonModule, SupportMeetingRoutingModule, SharedModule],
})
export class SupportMeetingModule {}
