import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { AuthService } from 'src/app/screens/auth/services/auth.service';
import { DataService } from '../../services/data.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ProfileService } from '../../services/profile.service';
import { UtilityService } from '../../services/utility.service';
import { CommonService } from '../../services/common.service';
import { AppPreferencesService } from '../../services/app-preferences.service';
import { ImageCroppedEvent, LoadedImage } from 'ngx-image-cropper';
import { log } from '@tensorflow/tfjs-core/dist/log';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {
  profileForm: FormGroup;
  userDetails;
  uploadedFile;
  croppedImage;
  passwordBox = false;
  passText = true;
  activeScreen = 'view_profile';
  passwordVisible: boolean = false;
  passwordVisibleSecond: boolean = false;
  constructor(
    private authService: AuthService,
    public dataService: DataService,
    private profileService: ProfileService,
    private commonService: CommonService,
    private utilService: UtilityService,
    private appPreference: AppPreferencesService,
    public router: Router,
    private dialogRef: MatDialogRef<ProfileComponent>
  ) {}

  ngOnInit(): void {
    this.userDetails = this.dataService.userDetails;
    this.initForm();
    this.setDatatoForm();
    let details = this.appPreference.getValue('oll_user_details');
    this.userDetails = JSON.parse(details);
    // this.profileForm.patchValue({
    //   user_id: this.userDetails.user_id,
    //   first_name: this.userDetails.first_name,
    //   last_name: this.userDetails.last_name,
    //   mobile_number: this.userDetails.mobile_number,
    //   // password: this.userDetails.password,
    // });
    this.profileForm.updateValueAndValidity();
  }

  initForm() {
    this.profileForm = new FormGroup({
      // user_id: new FormControl(null, [Validators.required]),
      firstName: new FormControl(null, [Validators.required]),
      lastName: new FormControl(null, [Validators.required]),
      mobileNumber: new FormControl(null, [Validators.required]),
      emailId: new FormControl(null, [Validators.required]),
      password: new FormControl(null, [Validators.required]),
      confirmPassword: new FormControl(null, [Validators.required]),
    });
  }

  setDatatoForm() {
    this.profileForm.patchValue({
      // user_id: this.userDetails?.user_id,
      firstName: this.userDetails?.first_name,
      lastName: this.userDetails?.last_name,
      mobileNumber: this.userDetails?.mobile_number,
      emailId: this.userDetails?.user_name,
    });
  }

  closeDialog() {
    this.dialogRef.close();
  }

  changeScreen(screen) {
    this.activeScreen = screen;
  }

  submitProfile() {
    let data = this.profileForm.getRawValue();
    if (!data.password || !data.confirmPassword) {
      delete data.password;
      delete data.confirmPassword;
    }
    this.profileService.updateProfile(data).subscribe((res) => {
      if (data.password && data.confirmPassword) {
        this.authService.logout();
        this.router.navigate(['/login']);
      }
      this.commonService.getUserDetails();
      this.utilService.showSuccessMessage('Profile updated successfully');
      this.activeScreen = 'view_profile';
    });
  }

  cancelProfileUpload() {
    this.activeScreen = 'view_profile';
    this.backUpload();
  }

  backUpload() {
    this.uploadedFile = null;
    this.croppedImage = null;
  }

  onFileDropped(files: Array<any>) {
    if (!this.uploadedFile) {
      this.uploadedFile = files;
    }
  }

  fileBrowseHandler(files) {
    if (!this.uploadedFile) {
      this.uploadedFile = files;
    }
  }

  imageCropped(event: ImageCroppedEvent) {
    this.croppedImage = event.base64;
  }

  imageLoaded(image: LoadedImage) {
    // show cropper
    // console.log(image);
  }

  cropperReady() {
    // cropper ready
  }

  loadImageFailed() {
    // show message
  }

  cancelProfilePreviewUpload() {
    this.activeScreen = 'upload_profile_pic';
    this.backUpload();
  }

  confirmFileUpload() {
    if (this.croppedImage) {
      let onlyBase64 = this.croppedImage.replace('data:image/png;base64,', '');
      let blob = this.utilService.b64toBlob(onlyBase64, 'image/png');
      // const blobUrl = URL.createObjectURL(blob);
      // this.dialogRef.close({
      //   image_blob: blob,
      //   type: 'confirm',
      //   base64: this.croppedImage,
      // });
      const formData = new FormData();
      formData.append('file', blob, 'profile_pic.png');
      this.profileService.uploadProfilePic(formData).subscribe({
        next: async (res) => {
          if (res) {
            await this.commonService.getUserDetails();
            const reader = new FileReader();
            reader.readAsDataURL(blob); // read file as data url
            reader.onload = (e) => {
              // called once readAsDataURL is completed
              let details = this.appPreference.getValue('oll_user_details');
              this.userDetails = JSON.parse(details);
              this.utilService.showSuccessMessage(
                'Profile Picture Uploaded Successfully'
              );
            };
          }
          this.backUpload();
          this.activeScreen = 'view_profile';
        },
        complete: () => {
          this.backUpload();
        },
        error: (err) => {
          if (err.status === 400) {
            // this.util.showErrorToast(this.translate.instant('Format Not Supported'));
          } else {
            this.utilService.showErrorMessage(
              'Error In Profile Picture Upload'
            );
          }
        },
      });
    }
  }

  openPasswordDiv() {
    this.passwordBox = true;
    this.passText = false;
  }

  closePassBox() {
    this.passwordBox = false;
    this.passText = true;
  }

  togglePasswordVisibility(): void {
    this.passwordVisible = !this.passwordVisible;
  }

  togglePasswordVisibilitySecond(): void {
    this.passwordVisibleSecond = !this.passwordVisibleSecond;
  }

  goToFaceAuthentication() {
    this.router.navigate(['/face-recognization']);
    this.dialogRef.close();
  }
}
