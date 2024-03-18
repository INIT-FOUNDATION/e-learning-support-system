import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import { Router } from '@angular/router';
import * as faceapi from 'face-api.js';
import { RegistrationService } from '../registration/services/registration.service';
import { UtilityService } from 'src/app/modules/shared/services/utility.service';
import { MatDialog } from '@angular/material/dialog';
import { FaceAuthenticationModalComponent } from 'src/app/modules/shared/modal/face-authentication-modal/face-authentication-modal/face-authentication-modal.component';
import { LoaderService } from 'src/app/modules/shared/services/loader.service';
import { DataService } from 'src/app/modules/shared/services/data.service';
@Component({
  selector: 'app-face-recognization',
  templateUrl: './face-recognization.component.html',
  styleUrls: ['./face-recognization.component.scss'],
})
export class FaceRecognizationComponent implements OnInit, AfterViewInit {
  WIDTH = 700;
  HEIGHT = 500;
  constructor(
    private elRef: ElementRef,
    private router: Router,
    private registrationService: RegistrationService,
    private utilityService: UtilityService,
    public dialog: MatDialog,
    private loaderService: LoaderService,
    private dataService: DataService
  ) {}
  stream: any;
  detection: any;
  resizedDetections: any;
  canvas: any;
  canvasEl: any;
  displaySize: any;
  videoInput: any;
  captures: any = '';
  zoomImage: any = '';
  disableCaptureButton = true;
  imageCaptured = false;
  ngOnInit() {}

  ngAfterViewInit(): void {
    setTimeout(() => {
      Promise.all([
        faceapi.nets.ssdMobilenetv1.loadFromUri('../../assets/weights'),
        faceapi.nets.tinyFaceDetector.loadFromUri('../../assets/weights'),
        faceapi.nets.faceLandmark68Net.loadFromUri('../../assets/weights'),
        faceapi.nets.faceRecognitionNet.loadFromUri('../../assets/weights'),
        faceapi.nets.faceExpressionNet.loadFromUri('../../assets/weights'),
      ]).then(() => {
        this.startVideo();
      });
    }, 100);
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
    this.detect_Faces();
  }

  async detect_Faces() {
    this.elRef.nativeElement
      .querySelector('video')
      .addEventListener('play', async () => {
        this.canvas = await faceapi.createCanvasFromMedia(this.videoInput);
        this.canvasEl = document.getElementById('canvasEl');
        this.canvasEl.appendChild(this.canvas);
        this.canvas.setAttribute('id', 'canvass');
        this.displaySize = {
          width: this.WIDTH,
          height: this.HEIGHT,
        };
        faceapi.matchDimensions(this.canvas, this.displaySize);
        setInterval(async () => {
          this.detection = await faceapi
            .detectAllFaces(
              this.videoInput,
              new faceapi.TinyFaceDetectorOptions()
            )
            .withFaceLandmarks()
            .withFaceExpressions();
          this.resizedDetections = faceapi.resizeResults(
            this.detection,
            this.displaySize
          );

          this.canvas
            .getContext('2d')
            .clearRect(0, 0, this.canvas.width, this.canvas.height);
          faceapi.draw.drawDetections(this.canvas, this.resizedDetections);
          if (this.resizedDetections && this.resizedDetections.length > 0) {
            this.disableCaptureButton = false;
          } else {
            this.disableCaptureButton = true;
          }
          // faceapi.draw.drawFaceLandmarks(this.canvas, this.resizedDetections);
          // faceapi.draw.drawFaceExpressions(this.canvas, this.resizedDetections);
        }, 100);
      });
  }

  async capture() {
    this.canvas.getContext('2d').drawImage(this.videoInput, 0, 0, 700, 500);
    this.captures = this.canvas.toDataURL('image/png');

    (document.getElementById('capturedImage') as HTMLImageElement).src =
      this.captures;

    const detections = await faceapi.detectAllFaces(
      document.getElementById('capturedImage') as HTMLImageElement
    );
    const faceImages = await faceapi.extractFaces(
      document.getElementById('capturedImage') as HTMLImageElement,
      detections
    );
    if (faceImages && faceImages.length > 0) {
      this.zoomImage = faceImages[0].toDataURL('image/png');
      this.imageCaptured = true;
      this.stopVideo();
    }
  }

  goToDashboard() {
    this.stopVideo();
    this.router.navigate(['/dashboard']);
  }

  confirmFaceAuth() {
    try {
      let onlyBase64 = this.zoomImage.replace('data:image/png;base64,', '');
      let blob = this.utilityService.b64toBlob(onlyBase64, 'image/png');

      const formData = new FormData();
      formData.append('file', blob, 'face_auth.png');
      this.registrationService
        .authenticateFace(formData)
        .subscribe((res: any) => {
          this.dialog.open(FaceAuthenticationModalComponent, {
            data: {
              success: true,
            },
          });
        });
    } catch (error) {
      console.log(error);
    }
  }

  retakeFaceAuth() {
    this.imageCaptured = false;
    this.captures = null;
    setTimeout(() => {
      this.startVideo();
    }, 100);
  }

  stopVideo() {
    var videoEl = document.getElementById('webCam') as HTMLVideoElement;
    if (videoEl) {
      videoEl.srcObject = null;
    }
  }
}
