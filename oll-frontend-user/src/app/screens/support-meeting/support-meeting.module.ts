import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SupportMeetingRoutingModule } from './support-meeting-routing.module';
import { SupportMeetingComponent } from './support-meeting.component';


@NgModule({
  declarations: [
    SupportMeetingComponent
  ],
  imports: [
    CommonModule,
    SupportMeetingRoutingModule
  ]
})
export class SupportMeetingModule { }
