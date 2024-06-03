import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import * as moment from 'moment';
import { UtilityService } from '../../services/utility.service';
import { SupportMeetingService } from 'src/app/screens/support-meeting/services/support-meeting.service';

@Component({
  selector: 'app-calendar-modal',
  templateUrl: './calendar-modal.component.html',
  styleUrls: ['./calendar-modal.component.scss'],
})
export class CalendarModalComponent implements OnInit {
  selected: Date | null;
  constructor(
    public dialogRef: MatDialogRef<CalendarModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private utilService: UtilityService,
    private supportService: SupportMeetingService
  ) {}

  time_options: any[];
  selectedSlot = moment().format('YYYY-MM-DD');
  minDate = new Date();
  selectSlots: FormGroup;
  ngOnInit(): void {
    this.ininitForm();
    this.getTimeSlots();
  }

  getTimeSlots() {
    this.selectedSlot = this.selectedSlot;
    this.create_time_intervals(moment(this.selectedSlot).format('YYYY-MM-DD'));

    const start = moment();
    const remainder = 30 - (start.minute() % 30);

    const preferedStartTime_moment = moment(start).add(remainder, 'minutes');
    const preferedEndTime_moment = moment(preferedStartTime_moment).add(
      60,
      'minutes'
    );

    let preferedStartTime = preferedStartTime_moment.format('HH:mm');
    let preferedEndTime = preferedEndTime_moment.format('HH:mm');
    this.selectSlots.get('preferedStartTime').valueChanges.subscribe((res) => {
      let scheduleDate = this.selectSlots.get('scheduleDate').value;
      preferedStartTime = this.selectSlots.get('preferedStartTime').value;
      if (preferedStartTime) {
        let scheduleDate_formatted = moment(scheduleDate).format('YYYY-MM-DD');
        let preferedStartTime_moment = moment(
          `${scheduleDate_formatted} ${preferedStartTime}`
        );
        if (preferedStartTime_moment.isValid()) {
          this.onStartTimeChange();
        } else {
          this.selectSlots.setErrors({ invalid: true });
          // this.disableButton = true;
        }
      }
    });

    this.selectSlots.get('preferedEndTime').valueChanges.subscribe((res) => {
      let scheduleDate = this.selectSlots.get('scheduleDate').value;
      preferedEndTime = this.selectSlots.get('preferedEndTime').value;
      if (preferedEndTime) {
        let scheduleDate_formatted = moment(scheduleDate).format('YYYY-MM-DD');
        let preferedEndTime_moment = moment(
          `${scheduleDate_formatted} ${preferedEndTime}`
        );
        if (!preferedEndTime_moment.isValid()) {
          this.selectSlots.setErrors({ invalid: true });
          this.selectSlots.updateValueAndValidity();
          // this.disableButton = true;
          return;
        } else {
          let preferedStartTime =
            this.selectSlots.get('preferedStartTime').value;
          let preferedStartTime_moment = moment(
            `${scheduleDate_formatted} ${preferedStartTime}`
          );
          if (preferedStartTime_moment.isAfter(preferedEndTime_moment)) {
            this.selectSlots.setErrors({ invalid: true });
            this.selectSlots.updateValueAndValidity();
            // this.disableButton = true;
            return;
          }
          // this.disableButton = false;
        }
      }
    });

    this.selectSlots
      .get('preferedStartTime')
      .setValue(
        this.data.preferedStartTime
          ? this.data?.preferedStartTime
          : preferedStartTime
      );
    this.selectSlots
      .get('preferedEndTime')
      .setValue(
        this.data.preferedEndTime ? this.data?.preferedEndTime : preferedEndTime
      );
  }

  onStartTimeChange() {
    this.selectSlots.get('preferedEndTime').enable();
    let scheduleDate = this.selectSlots.get('scheduleDate').value;
    let preferedStartTime = this.selectSlots.get('preferedStartTime').value;
    if (preferedStartTime) {
      let scheduleDate_formatted = moment(scheduleDate).format('YYYY-MM-DD');
      let preferedStartTime_moment = moment(
        `${scheduleDate_formatted} ${preferedStartTime}`
      );
      if (preferedStartTime_moment.isValid()) {
        let preferedEndTime_moment = moment(preferedStartTime_moment).add(
          30,
          'minutes'
        );

        if (
          moment(preferedStartTime_moment.format('YYYY-MM-DD')).isSame(
            moment(preferedEndTime_moment.format('YYYY-MM-DD'))
          )
        ) {
          this.selectSlots
            .get('preferedEndTime')
            .setValue(preferedEndTime_moment.format('HH:mm'));
        } else {
          this.selectSlots.get('preferedEndTime').setValue('11:59 pm');
          this.selectSlots.get('preferedEndTime').disable();
        }
      } else {
        this.selectSlots.setErrors({ invalid: true });
        // this.disableButton = true;
      }
    }
  }

  ininitForm() {
    this.selectSlots = new FormGroup({
      scheduleDate: new FormControl(
        moment(this.selectedSlot).format('YYYY-MM-DD')
      ),
      preferedStartTime: new FormControl(
        this.data?.value?.preferedStartTime
          ? this.data?.value?.preferedStartTime
          : null
      ),
      preferedEndTime: new FormControl(
        this.data?.value?.preferedEndTime
          ? this.data?.value?.preferedEndTime
          : null
      ),
      mobileNumber: new FormControl(
        this.data?.value?.mobileNumber ? this.data?.value?.mobileNumber : null
      ),
      name: new FormControl(
        this.data?.value?.name ? this.data?.value?.name : null
      ),
      educationQualification: new FormControl(
        this.data?.value?.educationQualification
          ? this.data?.value?.educationQualification
          : null
      ),
      categoryId: new FormControl(
        this.data?.value?.categoryId ? this.data?.value?.categoryId : null
      ),
      requestPurpose: new FormControl(
        this.data?.value?.requestPurpose
          ? this.data?.value?.requestPurpose
          : null
      ),
      preferredLanguage: new FormControl(
        this.data?.value?.preferredLanguage
          ? this.data?.value?.preferredLanguage
          : null
      ),
      problemStatement: new FormControl(
        this.data?.value?.problemStatement
          ? this.data?.value?.problemStatement
          : null
      ),
      parentRequestId: new FormControl(
        this.data?.value?.parentRequestId
          ? this.data?.value?.parentRequestId
          : null
      ),
      roleId: new FormControl(
        this.data?.value?.roleId ? this.data?.value?.roleId : null
      ),
    });
  }

  selectedDate(date: Date) {
    this.selectSlots.patchValue({
      scheduleDate: moment(date).format('YYYY-MM-DD'),
    });
    this.create_time_intervals(moment(date).format('YYYY-MM-DD'));
  }

  create_time_intervals(selectedDate) {
    let current_date = new Date();
    let hours: any;
    let minutes: any;
    if (moment(current_date).format('YYYY-MM-DD') == selectedDate) {
      hours = current_date.getHours();
      minutes = current_date.getMinutes();
    } else {
      hours = '09';
      minutes = '00';
    }

    let fromMoment = moment(`${selectedDate} ${hours}:${minutes}`);
    let untilMoment = moment(`${selectedDate} 23:59`);
    let intervals = [];
    for (let i = 0; i < 48; i++) {
      let minutes_to_add = i * 30;
      let moment_temp = moment(fromMoment);
      let time_moment = moment_temp.add(minutes_to_add, 'minutes');
      if (time_moment.isBefore(untilMoment)) {
        let time_formatted = time_moment.format('HH:mm');
        let time_formatted_label = time_moment.format('hh:mm a');
        intervals.push({ value: time_formatted, label: time_formatted_label });
      }
      this.time_options = intervals;
    }
    return intervals;
  }

  closeDialog() {
    this.dialogRef.close(this.selectSlots);
  }

  sumbitForm() {
    try {
      const formData = this.selectSlots.getRawValue();
      this.supportService.createIssueLogin(formData).subscribe((res: any) => {
        this.utilService.showSuccessMessage('Schedule meeting successfully!');
        this.closeDialog();
      });
    } catch (error) {
      console.log(error);
    }
  }
}
