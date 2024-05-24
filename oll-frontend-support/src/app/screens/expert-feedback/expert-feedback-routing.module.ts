import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ExpertFeedbackComponent } from './expert-feedback.component';

const routes: Routes = [{ path: '', component: ExpertFeedbackComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ExpertFeedbackRoutingModule {}
