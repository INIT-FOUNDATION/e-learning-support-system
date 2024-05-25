import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { CalendarModalComponent } from 'src/app/modules/shared/modal/calendar-modal/calendar-modal.component';
import { SupportMeetingService } from '../../services/support-meeting.service';
import { DataService } from 'src/app/modules/shared/services/data.service';

@Component({
  selector: 'app-counselor-form',
  templateUrl: './counselor-form.component.html',
  styleUrls: ['./counselor-form.component.scss'],
})
export class CounselorFormComponent implements OnInit {
  userLoginDetailsForm: FormGroup;
  selectedExpert: any;
  showExperts: boolean = false;
  educationalQualification: any = [];
  questionCategory: any = [];
  preferredLanguage: any = [];
  activeExperts: any = [];
  meeting_details: any;
  userDetails: any = [];
  @Input() requestDetailsFromParent: any;
  isSelectedRadioOption: any = 'enquiries';
  dialogClosedData: boolean = false;
  getUserData: any = [];

  supportQueries: any = [
    { id: 1, name: 'I want to learn Zoho' },
    { id: 2, name: 'I want to learn Gmail' },
    { id: 3, name: 'I want to learn chatGpt' },
  ];

  constructor(
    private dialog: MatDialog,
    private supportService: SupportMeetingService,
    public dataService: DataService
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
  }

  initForm() {
    this.userLoginDetailsForm = new FormGroup({
      mobileNumber: new FormControl(
        this.getUserData.mobileNumber ? this.getUserData.mobileNumber : null,
        [
          Validators.required,
          Validators.pattern('[0-9]*'),
          Validators.maxLength(10),
          Validators.minLength(10),
        ]
      ),
      name: new FormControl(
        this.getUserData.name ? this.getUserData.name : null,
        [Validators.required]
      ),
      educationQualification: new FormControl(
        this.getUserData.educationQualification
          ? this.getUserData.educationQualification
          : null,
        [Validators.required]
      ),
      categoryId: new FormControl(
        this.requestDetailsFromParent?.requestDetails?.requestPurpose,
        [Validators.required]
      ),
      preferredLanguage: new FormControl(
        this.getUserData.preferredLanguage
          ? this.getUserData.preferredLanguage
          : null,
        [Validators.required]
      ),
      notes: new FormControl(null, [Validators.required]),
      scheduleDate: new FormControl(null),
      preferedStartTime: new FormControl(null),
      preferedEndTime: new FormControl(null),
      parentRequestId: new FormControl(
        this.requestDetailsFromParent?.requestDetails?.requestId
      ),
    });
  }

  getCourseDetails() {
    this.supportService.getCourseList().subscribe((res: any) => {
      this.questionCategory = res?.data?.course;
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

  getAvailableExpertsList(expert_id) {
    this.supportService.getExpertsList(expert_id).subscribe((res: any) => {
      this.activeExperts = res?.data;
    });
  }

  getMobileNumber(mobile_number) {
    this.supportService
      .getUserByMobileNumber(mobile_number)
      .subscribe((res: any) => {
        this.getUserData = res?.data;
        this.initForm();
      });
  }

  showExpertsList(expert_id) {
    this.getAvailableExpertsList(expert_id);
    this.showExperts = true;
  }

  selectExpert(expert_id) {
    this.selectedExpert = expert_id;
  }

  opencalendarModal() {
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
  }

  submitUserForm() {
    console.log(this.userLoginDetailsForm.getRawValue());
    // try {
    //   const formData = this.userLoginDetailsForm.getRawValue();
    //   this.supportService.createIssueLogin(formData).subscribe((res: any) => {
    //     console.log(res);
    //   });
    // } catch (error) {
    //   console.log(error);
    // }
  }
}
