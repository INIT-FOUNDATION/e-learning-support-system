import { Component, OnInit } from '@angular/core';
import { MatSelectChange } from '@angular/material/select';
import { NavigationExtras, Router } from '@angular/router';

@Component({
  selector: 'app-expert-dashboard',
  templateUrl: './expert-dashboard.component.html',
  styleUrls: ['./expert-dashboard.component.scss'],
})
export class ExpertDashboardComponent implements OnInit {
  selectedMeetingFilter = 1;
  callQueueWaitingList: any = [
    {
      id: 1,
      is_active: false,
      requestedByUser: 'Guest-123456789',
      wait_time: '10 secsond(s)',
      requestPurpose: 'Python',
      meeting_code: 'qwerty',
    },
  ];

  onGoingCalls: any = [
    {
      id: 1,
      is_active: false,
      requestedByUser: 'Guest-123456789',
      wait_time: 'Call is in progress',
      requestPurpose: 'Python',
      meeting_code: 'qwerty',
    },
    {
      id: 2,
      is_active: false,
      requestedByUser: 'Guest-123456789',
      wait_time: 'Call is in progress',
      requestPurpose: 'Web Designing',
      meeting_code: 'qwerty',
    },
    {
      id: 3,
      is_active: false,
      requestedByUser: 'Guest-123456789',
      wait_time: 'Call is in progress',
      requestPurpose: 'General',
      meeting_code: 'qwerty',
    },
  ];

  scheduledCalls: any = [
    {
      id: 1,
      is_active: false,
      requestedByUser: 'Shubham Baranwal',
      date: '28th May 2024',
      requestPurpose: 'Javascript',
      meeting_code: 'qwerty',
      time: '6pm - 6:30pm',
    },
    {
      id: 2,
      is_active: false,
      requestedByUser: 'Trupti',
      date: '30th May 2024',
      requestPurpose: 'NodeJS',
      meeting_code: 'qwerty',
      time: '6pm - 6:30pm',
    },
    {
      id: 3,
      is_active: false,
      requestedByUser: 'CK',
      date: '30th May 2024',
      requestPurpose: 'Java',
      meeting_code: 'qwerty',
      time: '6pm - 6:30pm',
    },
  ];

  meetingHistoryFilter: any = [
    { id: 1, label: 'Today' },
    { id: 2, label: 'Yesterday' },
    { id: 3, label: 'Last 15 days' },
    { id: 4, label: 'Last 30 days' },
    { id: 5, label: 'All' },
  ];

  callQueueFilter: any = [
    { id: 1, label: 'Call Queue' },
    { id: 2, label: 'On going Calls' },
    { id: 3, label: 'Scheduled Calls' },
  ];
  selectedCallQueueFilter = 1;
  constructor(public router: Router) {}

  ngOnInit(): void {}

  changeFilter(event) {
    // this.selectedMeetingFilter = event.value;
    // this.currentPage = 1;
    // this.callHistoryList = [];
    // this.meetingHistory(this.userId);
  }

  acceptRequest(data) {
    const navigationExtras: NavigationExtras = {
      state: {
        ...data,
        isSupportuser: false,
        backend_server_url: 'jitsi.orrizonte.in',
      },
    };
    this.router.navigate(['/support'], navigationExtras);
  }

  changeCallQueueFilter(event: MatSelectChange) {
    this.selectedCallQueueFilter = event.value;
  }
}
