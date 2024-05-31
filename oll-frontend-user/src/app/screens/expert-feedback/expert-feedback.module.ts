import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ExpertFeedbackRoutingModule } from './expert-feedback-routing.module';
import { ExpertFeedbackComponent } from './expert-feedback.component';
import { SharedModule } from 'src/app/modules/shared/shared.module';

@NgModule({
  declarations: [ExpertFeedbackComponent],
  imports: [CommonModule, ExpertFeedbackRoutingModule, SharedModule],
})
export class ExpertFeedbackModule {}
