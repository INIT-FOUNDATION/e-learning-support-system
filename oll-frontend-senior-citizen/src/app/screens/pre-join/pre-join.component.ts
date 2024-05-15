import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-pre-join',
  templateUrl: './pre-join.component.html',
  styleUrls: ['./pre-join.component.scss'],
})
export class PreJoinComponent implements OnInit {
  videoInput: any;
  stopStartLabel: boolean = false;
  muteUnmuteLabel: boolean = false;
  ngOnInit(): void {
    this.startVideo();
  }

  startVideo() {
    this.videoInput = document.getElementById('webCam') as HTMLVideoElement;
    navigator.mediaDevices
      .getUserMedia({ video: {}, audio: false })
      .then((stream: any) => {
        this.videoInput.srcObject = stream;
      })
      .catch((err: any) => {
        console.log(err);
      });
  }

  stopCamera() {
    this.stopStartLabel = !this.stopStartLabel;
    if (this.stopStartLabel) {
      this.videoInput.srcObject = null;
    } else {
      this.startVideo();
    }
  }

  muteMic() {
    this.muteUnmuteLabel = !this.muteUnmuteLabel;
    if (this.muteUnmuteLabel) {
      this.videoInput.muted = true;
    } else {
      this.videoInput.muted = false;
    }
  }
}
