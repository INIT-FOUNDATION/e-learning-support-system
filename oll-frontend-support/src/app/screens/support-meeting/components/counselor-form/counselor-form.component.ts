import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { CalendarModalComponent } from 'src/app/modules/shared/modal/calendar-modal/calendar-modal.component';
import { SupportMeetingService } from '../../services/support-meeting.service';
import { DataService } from 'src/app/modules/shared/services/data.service';
import { UtilityService } from 'src/app/modules/shared/services/utility.service';
import { MatOption } from '@angular/material/core';
import { RegistrationService } from 'src/app/screens/registration/services/registration.service';

@Component({
  selector: 'app-counselor-form',
  templateUrl: './counselor-form.component.html',
  styleUrls: ['./counselor-form.component.scss'],
})
export class CounselorFormComponent implements OnInit {
  userLoginDetailsForm: FormGroup;
  selectedExpert: any;
  selectedExpertName: any = [];
  showExperts: boolean = false;
  educationalQualification: any = [];
  questionCategory: any = [];
  preferredLanguage: any = [];
  activeExperts: any = [];
  meeting_details: any;
  userDetails: any = [];
  @Input() requestDetailsFromParent: any;
  isSelectedRadioOption: any = 'Expert';
  dialogClosedData: boolean = false;
  getUserData: any = [];
  supportQueries: any = [
    { id: 1, name: 'I want to learn Zoho' },
    { id: 2, name: 'I want to learn Gmail' },
    { id: 3, name: 'I want to learn chatGpt' },
  ];
  rolesList: any = [];
  roleId: string = '0ec7b2da-fafc-4e9a-a369-5ad1f298905c';
  constructor(
    private dialog: MatDialog,
    private supportService: SupportMeetingService,
    public dataService: DataService,
    private utilService: UtilityService,
    private roleService: RegistrationService
  ) {}

  ngOnInit(): void {
    this.dataService.userData.subscribe((res) => {
      if (res) {
        this.userDetails = res;
      }
    });
    this.initForm();
    this.getCourseDetails();
    this.getEducationalQualificationList();
    this.getPreferredLanguagesList();
    this.getRoles();
  }

  initForm() {
    this.userLoginDetailsForm = new FormGroup({
      mobileNumber: new FormControl(null, [
        Validators.required,
        Validators.pattern('[0-9]*'),
        Validators.maxLength(10),
        Validators.minLength(10),
      ]),
      name: new FormControl(null, [Validators.required]),
      educationQualification: new FormControl(null, [Validators.required]),
      categoryId: new FormControl(null),
      requestPurpose: new FormControl(
        this.requestDetailsFromParent?.requestDetails?.requestPurpose
          ? this.requestDetailsFromParent?.requestDetails?.requestPurpose
          : null,
        [Validators.required]
      ),
      preferredLanguage: new FormControl(null, [Validators.required]),
      problemStatement: new FormControl(null, [Validators.required]),
      scheduleDate: new FormControl(null),
      preferedStartTime: new FormControl(null),
      preferedEndTime: new FormControl(null),
      userId: new FormControl(null),
      parentRequestId: new FormControl(
        this.requestDetailsFromParent?.requestDetails?.requestId
      ),
      roleId: new FormControl(null),
      // guestUserId: new FormControl(null),
    });
  }

  getCourseDetails() {
    this.supportService.getCourseList().subscribe((res: any) => {
      this.questionCategory = res?.data?.course;
      const requestPurpose =
        this.requestDetailsFromParent?.requestDetails?.requestPurpose;
      if (requestPurpose) {
        const currentRequestPurpose = this.questionCategory.find(
          (item) => item.name.toLowerCase() == requestPurpose.toLowerCase()
        );

        if (currentRequestPurpose) {
          this.userLoginDetailsForm
            .get('categoryId')
            .setValue(currentRequestPurpose.id);
          this.getAvailableExpertsList(currentRequestPurpose.id);
          // this.showExperts = true;
        }
      }
    });
  }

  getEducationalQualificationList() {
    this.supportService.getEducationalQualification().subscribe((res: any) => {
      this.educationalQualification = res?.data;
    });
  }

  getPreferredLanguagesList() {
    this.supportService.getPreferredLanguages().subscribe((res: any) => {
      this.preferredLanguage = res?.data;
    });
  }

  async getAvailableExpertsList(categoryId) {
    const payload: any = {
      categoryId: categoryId,
      roleId: this.roleId,
    };

    const expertsList: any = await this.supportService
      .getExpertsList(payload)
      .toPromise();
    this.activeExperts = expertsList.data;
    if (this.activeExperts.length > 0) {
      this.showExperts = true;
    }
  }

  getRoles() {
    this.roleService.getRoles().subscribe((res) => {
      this.rolesList = res?.roles;

      const roleDetails = this.rolesList.find(
        (item) => item?.role_name === this.isSelectedRadioOption
      );
      this.roleId = roleDetails?.role_id;
    });
  }

  getMobileNumber(mobile_number) {
    this.supportService
      .getUserByMobileNumber(mobile_number)
      .subscribe((res: any) => {
        this.getUserData = res?.data;
        this.userLoginDetailsForm
          .get('mobileNumber')
          .setValue(this.getUserData.mobileNumber);
        this.userLoginDetailsForm.get('name').setValue(this.getUserData.name);
        this.userLoginDetailsForm
          .get('educationQualification')
          .setValue(this.getUserData.educationQualification);
        this.userLoginDetailsForm
          .get('preferredLanguage')
          .setValue(this.getUserData.preferredLanguage);
        // this.userLoginDetailsForm
        //   .get('guestUserId')
        //   .setValue(this.getUserData.guestUserId);
      });
  }

  showExpertsList(expertDetails) {
    const value: MatOption = expertDetails.source.selected;
    this.getAvailableExpertsList(expertDetails.value);
    this.userLoginDetailsForm.get('requestPurpose').setValue(value.getLabel());
    // this.showExperts = true;
  }

  selectExpert(expertDetails) {
    this.selectedExpert = expertDetails?.userId;
    this.selectedExpertName = expertDetails?.userName;
    this.userLoginDetailsForm.get('userId').setValue(expertDetails?.userId);
  }

  opencalendarModal() {
    this.userLoginDetailsForm.get('roleId').setValue(this.roleId);
    let dialogRef = this.dialog.open(CalendarModalComponent, {
      width: 'clamp(25rem, 35vw, 40rem)',
      maxWidth: 'unset',
      panelClass: [
        'animate__animated',
        'animate__slideInRight',
        'breakoutRoomPanel',
      ],
      data: this.userLoginDetailsForm,
      position: { right: '0px', top: '0px', bottom: '0px' },
      disableClose: false,
    });

    dialogRef.afterClosed().subscribe((res: any) => {
      this.userLoginDetailsForm.disable();
      this.dialogClosedData = true;
      this.showExperts = false;
      this.userLoginDetailsForm.patchValue({
        scheduleDate: res?.value?.scheduleDate,
        preferedStartTime: res?.value?.preferedStartTime,
        preferedEndTime: res?.value.preferedEndTime,
      });
    });
  }

  choosedOption(value) {
    this.isSelectedRadioOption = value;
    const roleDetails = this.rolesList.find(
      (item) => item?.role_name === value
    );
    this.roleId = roleDetails.role_id;
    if (value !== 'Expert') {
      this.getAvailableExpertsList(null);
    }
  }

  async submitUserForm() {
    try {
      await this.getAvailableExpertsList(
        this.userLoginDetailsForm.get('categoryId').value
      );

      if (
        this.activeExperts.some(
          (item) =>
            item.userId === this.userLoginDetailsForm.get('userId').value
        )
      ) {
        if (this.isSelectedRadioOption !== 'Expert') {
          this.userLoginDetailsForm.removeControl('categoryId');
        }
        this.userLoginDetailsForm.get('roleId').setValue(this.roleId);
        const formData = this.userLoginDetailsForm.getRawValue();
        this.supportService.createIssueLogin(formData).subscribe((res: any) => {
          this.utilService.showSuccessMessage(
            `Schedule meeting successfully with ${this.selectedExpertName}!`
          );
          this.userLoginDetailsForm.disable();
        });
      } else {
        this.utilService.showErrorMessage('Expert not available');
        if (this.activeExperts.length == 0) {
          this.opencalendarModal();
        }
      }
    } catch (error) {
      console.log(error);
    }
  }
}
