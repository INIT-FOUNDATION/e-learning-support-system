import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FaceRecognizationComponent } from './face-recognization.component';

const routes: Routes = [{ path: '', component: FaceRecognizationComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FaceRecognizationRoutingModule {}
