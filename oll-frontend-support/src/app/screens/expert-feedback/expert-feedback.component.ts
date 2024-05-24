import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-expert-feedback',
  templateUrl: './expert-feedback.component.html',
  styleUrls: ['./expert-feedback.component.scss'],
})
export class ExpertFeedbackComponent implements OnInit {
  bgSelectedColor: any;
  ratingsStarArray: any = [
    { id: 1, img: 'starRatings' },
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

  ngOnInit(): void {}

  selectedExperience(value) {
    this.bgSelectedColor = value;
  }
}
