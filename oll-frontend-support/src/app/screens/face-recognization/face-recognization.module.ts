import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FaceRecognizationRoutingModule } from './face-recognization-routing.module';
import { FaceRecognizationComponent } from './face-recognization.component';


@NgModule({
  declarations: [FaceRecognizationComponent],
  imports: [
    CommonModule,
    FaceRecognizationRoutingModule
  ]
})
export class FaceRecognizationModule { }
