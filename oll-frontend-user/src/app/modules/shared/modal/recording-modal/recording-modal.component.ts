import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-recording-modal',
  templateUrl: './recording-modal.component.html',
  styleUrls: ['./recording-modal.component.scss'],
})
export class RecordingModalComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: { recordingUrl: string }) {}
}
