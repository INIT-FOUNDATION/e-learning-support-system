import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SupportMeetingComponent } from './support-meeting.component';

const routes: Routes = [
  { path: '', component: SupportMeetingComponent },
  { path: ':meetingCode', component: SupportMeetingComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SupportMeetingRoutingModule {}
