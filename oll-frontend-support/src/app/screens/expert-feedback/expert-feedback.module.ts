import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ExpertFeedbackRoutingModule } from './expert-feedback-routing.module';
import { ExpertFeedbackComponent } from './expert-feedback.component';

@NgModule({
  declarations: [ExpertFeedbackComponent],
  imports: [CommonModule, ExpertFeedbackRoutingModule],
})
export class ExpertFeedbackModule {}
