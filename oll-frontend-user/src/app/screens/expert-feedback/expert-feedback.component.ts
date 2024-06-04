import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SupportMeetingService } from '../support-meeting/services/support-meeting.service';
import { state } from '@angular/animations';
import { FormControl, FormGroup } from '@angular/forms';
import { UtilityService } from 'src/app/modules/shared/services/utility.service';

@Component({
  selector: 'app-expert-feedback',
  templateUrl: './expert-feedback.component.html',
  styleUrls: ['./expert-feedback.component.scss'],
})
export class ExpertFeedbackComponent implements OnInit {
  bgSelectedColor: any = [];
  requestId: any;
  expertFeedbackForm: FormGroup;
  expertDetails: any = [];
  ratingsGiven: number = 1;
  markedFavourite: boolean = false;
  feedback_points: any = [];
  submittedForm: boolean = false;
  ratingsStarArray: any = [
    { id: 1, img: 'yellowStarIcon' },
    { id: 2, img: 'starRatings' },
    { id: 3, img: 'starRatings' },
    { id: 4, img: 'starRatings' },
    { id: 5, img: 'starRatings' },
  ];

  didYouLike: any = [
    { id: 1, label: 'Good Communication' },
    { id: 2, label: 'Command on Topic' },
    { id: 3, label: 'Examples provided' },
  ];

  constructor(
    private router: Router,
    private supportService: SupportMeetingService,
    private UtilityService: UtilityService
  ) {
    const navigation = this.router.getCurrentNavigation();
    const state: any = navigation.extras.state;
    this.requestId = state.requestId;
  }

  ngOnInit(): void {
    this.getFeedbackDetails();
  }

  markedFav(value) {
    this.markedFavourite = value;
  }

  feedbackRatings(value) {
    this.ratingsGiven = value;

    this.ratingsStarArray.forEach((item) => {
      if (item.id <= value) {
        item.img = 'yellowStarIcon';
      } else {
        item.img = 'starRatings';
      }
    });
  }

  selectedExperience(value) {
    this.feedback_points.push(value.label);
    this.changeBgColor(value.id);
    const index = this.bgSelectedColor.findIndex(
      (item) => item.id === value.id
    );
    if (index === -1) {
      this.bgSelectedColor.push(value);
    } else {
      this.bgSelectedColor.splice(index, 1);
    }
  }

  changeBgColor(id) {
    const count = this.bgSelectedColor.filter((item) => item.id === id).length;
    return count % 2 !== 0;
  }

  getFeedbackDetails() {
    this.supportService
      .getExpertsDetailsForFeedback(this.requestId)
      .subscribe((res: any) => {
        this.expertDetails = res?.data;
      });
  }

  submitForm() {
    try {
      const payload: any = {
        requestId: this.requestId,
        mark_as_favourite: this.markedFavourite,
        ratings: this.ratingsGiven,
        feedback: this.feedback_points,
      };
      this.supportService.userFeedback(payload).subscribe((res) => {
        this.UtilityService.showSuccessMessage('Thank you for your feedback');
        window.location.href = 'https://www.oll.co/';
      });
    } catch (error) {}
  }
}
