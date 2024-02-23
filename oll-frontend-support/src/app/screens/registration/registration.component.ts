import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { RegistrationService } from './services/registration.service';
import { ToastrService } from 'ngx-toastr';
import { UtilityService } from 'src/app/modules/shared/services/utility.service';
import { AppPreferencesService } from 'src/app/modules/shared/services/app-preferences.service';
import { CommonService } from 'src/app/modules/shared/services/common.service';
declare var google: any;
@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss'],
})
export class RegistrationComponent implements OnInit {
  googledUserInfo: any;
  passwordValidation: boolean = false;
  rolesList: any = [];
  countryCodesList: any = [];
  constructor(
    private router: Router,
    private registrationService: RegistrationService,
    private utilityService: UtilityService,
    private appPreferences: AppPreferencesService,
    private commonService: CommonService
  ) {
    const navigation = this.router.getCurrentNavigation();
    const state: any = navigation?.extras.state;
    if (state) {
      this.googledUserInfo = state;
    }
  }

  submitAttempt: boolean = false;
  registrationForm = new FormGroup({
    firstName: new FormControl('', [
      Validators.required,
      Validators.minLength(3),
      Validators.maxLength(30),
    ]),
    lastName: new FormControl('', [
      Validators.required,
      Validators.minLength(3),
      Validators.maxLength(30),
    ]),
    emailId: new FormControl('', [Validators.required, Validators.email]),
    dialCode: new FormControl('+91', [Validators.required]),
    mobileNumber: new FormControl('', [
      Validators.required,
      Validators.maxLength(14),
      Validators.minLength(6),
    ]),
    roleId: new FormControl(null, [Validators.required]),
    password: new FormControl('', [Validators.required]),
    confirmPassword: new FormControl('', [Validators.required]),
  });

  ngOnInit(): void {
    this.registrationForm.patchValue({
      firstName: this.googledUserInfo?.given_name,
      lastName: this.googledUserInfo?.family_name,
      emailId: this.googledUserInfo?.email,
    });
    this.getRoles();
    this.getCountryCodes();
  }

  getRoles() {
    this.registrationService.getRoles().subscribe((res: any) => {
      this.rolesList = res.roles;
    });
  }

  getCountryCodes() {
    this.registrationService.getCountryCodes().subscribe((res: any) => {
      this.countryCodesList = res.codes;
    });
  }

  signout() {
    google.accounts.id.disableAutoSelect();
    this.router.navigate(['/login']);
  }

  register() {
    this.passwordValidation =
      this.registrationForm.value.password !==
      this.registrationForm.value.confirmPassword
        ? true
        : false;

    if (this.registrationForm.valid && !this.passwordValidation) {
      const formData = this.registrationForm.getRawValue();
      this.registrationService
        .registerNewUser(formData)
        .subscribe((res: any) => {
          if (res.token) {
            this.utilityService.showSuccessMessage(
              'User Created Successfully!'
            );
            this.appPreferences.setValue('user_token', res.token);
            this.commonService.getUserDetails({
              token: res.token,
              redirect: false,
            });
            this.router.navigate(['/face-recognization']);
          }
        });
    } else {
      this.submitAttempt = true;
    }
  }

  validateNumber(e): boolean {
    const charCode = e.which ? e.which : e.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }
}
