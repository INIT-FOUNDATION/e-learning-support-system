import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
} from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { NavigationExtras, Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { AuthService } from '../../services/auth.service';
import { AppPreferencesService } from 'src/app/modules/shared/services/app-preferences.service';
import { CommonService } from 'src/app/modules/shared/services/common.service';
import * as faceapi from 'face-api.js';
import { UtilityService } from 'src/app/modules/shared/services/utility.service';
import { MatDialog } from '@angular/material/dialog';
import { FaceAuthenticationModalComponent } from 'src/app/modules/shared/modal/face-authentication-modal/face-authentication-modal/face-authentication-modal.component';
import { Subscription } from 'rxjs';
import { CookieService } from 'src/app/modules/shared/services/cookies.service';
declare var google: any;
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit, AfterViewInit, OnDestroy {
  constructor(
    private router: Router,
    private authService: AuthService,
    private appPreferences: AppPreferencesService,
    private commonService: CommonService,
    private formBuilder: FormBuilder,
    private elRef: ElementRef,
    private utilityService: UtilityService,
    public dialog: MatDialog,
    private cookieService: CookieService
  ) {}
  userExists: boolean = false;
  registerUser: boolean = false;
  invalidPassword: boolean = false;
  loginForm: FormGroup;
  loginUsing = 'password';
  WIDTH = 700;
  HEIGHT = 500;

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
  interval;
  handleFaceClick: any = 0;
  subscription: Subscription[] = [];
  ngOnInit(): void {
    this.initLoginForm();

    const emailId = this.cookieService.getCookie('emailId');
    if (emailId) {
      this.loginForm.get('emailId').setValue(emailId);
    }
  }

  ngAfterViewInit(): void {
    console.log(this.authService.getMeetingCode);

    setTimeout(() => {
      google.accounts.id.initialize({
        client_id: environment.googleSignIn.client_id,
        nonce: 'sahdhjchbh&',
        callback: (response: any) => {
          const decodedUserInfo = this.decodeJWTToken(response.credential);
          this.cookieService.setCookie('emailId', decodedUserInfo.email);
          const navigationExtras: NavigationExtras = {
            state: {
              ...decodedUserInfo,
            },
          };
          const payload: any = {
            credentials: response.credential,
          };
          this.authService
            .googleSignInValidator(payload)
            .subscribe((res: any) => {
              if (res.exists) {
                this.appPreferences.setValue('user_token', res.token);
                this.commonService.getUserDetails({
                  token: res.token,
                  redirect: false,
                });
                if (this.authService.getMeetingCode) {
                  this.router.navigate([
                    `${environment.lss_web_url}${this.authService.getMeetingCode}`,
                  ]);
                } else {
                  this.router.navigate(['/dashboard']);
                }
              } else {
                this.router.navigate(['/registration'], navigationExtras);
              }
            });
        },
      });

      google.accounts.id.renderButton(document.getElementById('google-btn'), {
        theme: 'white',
        size: 'large',
        shape: 'pill',
        width: 320,
      });

      Promise.all([
        faceapi.nets.ssdMobilenetv1.loadFromUri('../../assets/weights'),
        faceapi.nets.tinyFaceDetector.loadFromUri('../../assets/weights'),
        faceapi.nets.faceLandmark68Net.loadFromUri('../../assets/weights'),
        faceapi.nets.faceRecognitionNet.loadFromUri('../../assets/weights'),
        faceapi.nets.faceExpressionNet.loadFromUri('../../assets/weights'),
      ]).then(async () => {
        await this.startVideo();
      });
    }, 100);
  }

  async startVideo() {
    this.videoInput = document.getElementById('webCam') as HTMLVideoElement;
    if (this.videoInput) {
      navigator.mediaDevices
        .getUserMedia({ video: {}, audio: false })
        .then((stream: any) => {
          this.videoInput.srcObject = stream;
        })
        .catch((err: any) => {
          console.log(err);
        });
      await this.detect_Faces();
    }
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
        this.interval = setInterval(async () => {
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

          setTimeout(() => {
            if (this.resizedDetections && this.resizedDetections.length > 0) {
              this.capture();
            }
          }, 100);
        }, 100);
      });
  }

  loginUsingPassword() {
    this.stopVideo();
    this.loginUsing = 'password';
  }

  retakeFaceAuth() {
    this.imageCaptured = false;
    this.captures = null;
    setTimeout(() => {
      this.startVideo();
    }, 100);
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
      this.imageCaptured = true;
      clearInterval(this.interval);
      this.zoomImage = faceImages[0].toDataURL('image/png');
      this.stopVideo();
      this.confirmFaceAuth();
    }
  }

  confirmFaceAuth() {
    try {
      let onlyBase64 = this.captures.replace('data:image/png;base64,', '');
      let blob = this.utilityService.b64toBlob(onlyBase64, 'image/png');

      const formData = new FormData();
      formData.append('file', blob, 'face_auth.png');
      formData.append('user_name', this.loginForm.value.emailId);

      if (this.subscription.length <= 4) {
        const subs = this.authService
          .loginUsingFace(formData)
          .subscribe((res: any) => {
            if (res.token) {
              this.appPreferences.setValue('user_token', res.token);
              this.commonService.getUserDetails({
                token: res.token,
                redirect: false,
              });
              if (this.authService.getMeetingCode) {
                this.router.navigate([
                  `${environment.lss_web_url}${this.authService.getMeetingCode}`,
                ]);
              } else {
                this.router.navigate(['/dashboard']);
              }
            } else {
              if (this.subscription.length == 3) {
                this.stopFaceAuth();
                setTimeout(() => {
                  const dialogref = this.dialog.open(
                    FaceAuthenticationModalComponent,
                    {
                      data: { success: false },
                    }
                  );
                  this.loginUsing = 'password';
                }, 300);
              } else {
                this.utilityService.showErrorMessage(
                  'Face authentication failed, Please try again with better lighting conditions'
                );
                this.retakeFaceAuth();
              }
            }
          });
        this.subscription.push(subs);
      }
    } catch (error) {
      console.log(error);
    }
  }

  stopVideo() {
    var videoEl = document.getElementById('webCam') as HTMLVideoElement;
    if (videoEl) {
      videoEl.srcObject = null;
    }
  }

  initLoginForm(): void {
    this.loginForm = this.formBuilder.group({
      emailId: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  decodeJWTToken(token: string) {
    return JSON.parse(atob(token.split('.')[1]));
  }

  LoginWithPassword() {
    const formData = this.userExists
      ? this.loginForm.getRawValue()
      : { emailId: this.loginForm.value.emailId };
    this.cookieService.setCookie('emailId', this.loginForm.value.emailId);
    if (!this.userExists) {
      this.authService.validateUser(formData).subscribe((res: any) => {
        this.userExists = res.exists;
        this.loginUsing = res.face_auth_enable ? 'face' : 'password';
        setTimeout(() => {
          this.startVideo();
        }, 100);
        if (this.userExists) {
          this.registerUser = false;
        } else {
          this.redirectToRegistration(this.loginForm.value.emailId);
        }
      });
    } else if (this.userExists) {
      try {
        this.authService.signIn(formData).subscribe(
          (res: any) => {
            if (res.token) {
              this.appPreferences.setValue('user_token', res.token);
              this.commonService.getUserDetails({
                token: res.token,
                redirect: false,
              });
              this.router.navigate(['/dashboard']);
            }
          },
          (error: any) => {
            if (error.status === 400) {
              this.loginForm
                .get('password')
                .setErrors({ invalidPassword: true });
            } else {
              console.error('Error occurred during sign-in:', error);
            }
          }
        );
      } catch (error) {
        this.userExists = false;
      }
    }
  }

  redirectToRegistration(emailId) {
    const navigationExtras: NavigationExtras = {
      state: {
        email: emailId,
      },
    };
    this.router.navigate(['/registration'], navigationExtras);
  }

  stopFaceAuth() {
    if (this.interval) {
      clearInterval(this.interval);
    }

    if (this.subscription && this.subscription.length > 0) {
      this.subscription.forEach((sub) => sub.unsubscribe());
    }
  }

  ngOnDestroy(): void {
    this.stopFaceAuth();
  }
}
