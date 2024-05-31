import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
  TemplateRef,
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { SupportMeetingService } from '../../services/support-meeting.service';
import { UtilityService } from 'src/app/modules/shared/services/utility.service';

@Component({
  selector: 'app-expert-form',
  templateUrl: './expert-form.component.html',
  styleUrls: ['./expert-form.component.scss'],
})
export class ExpertFormComponent implements OnInit {
  @Input() requestDetailsFromParent: any;
  userLoginDetailsForm: FormGroup;
  addSolutionForm: FormGroup;
  historyFormArray: any = [];
  showTranscription: boolean = false;
  currentIndex = 0;
  formSubmitted: boolean = false;
  constructor(
    public dialog: MatDialog,
    private supportMeetingService: SupportMeetingService,
    private utilService: UtilityService
  ) {}

  ngOnInit(): void {
    this.getUserData();
    this.initForm();
  }

  initForm() {
    this.addSolutionForm = new FormGroup({
      solutionSuggested: new FormControl(null),
      requestId: new FormControl(this.requestDetailsFromParent?.requestId),
      notes: new FormControl(null),
    });
  }

  showPreviousData() {
    if (this.currentIndex > 0) {
      this.currentIndex = this.currentIndex - 1;
    }
  }

  showNextData() {
    if (this.currentIndex < this.historyFormArray.length - 1) {
      this.currentIndex = this.currentIndex + 1;
    }
  }

  openTranscriptModal(transcriptModal: TemplateRef<any>) {
    this.dialog.open(transcriptModal, {
      maxHeight: '30rem',
      width: '100%',
      panelClass: [
        'animate__animated',
        'animate__slideInUp',
        'bottom-0',
        'position-absolute',
        'mb-3',
      ],
    });
  }

  closeTranscriptionModal() {
    this.dialog.closeAll();
  }

  getUserData() {
    try {
      const payload: any = {
        guestUserId: this.requestDetailsFromParent?.requestedByUserId,
        categoryId: this.requestDetailsFromParent?.categoryId,
      };
      this.supportMeetingService
        .getRequestByGuest(payload)
        .subscribe((res: any) => {
          this.historyFormArray = res?.data;
          this.currentIndex = this.historyFormArray.length - 1;
        });
    } catch (error) {
      console.log(error);
    }
  }

  submitForm() {
    try {
      const formData = this.addSolutionForm.getRawValue();
      this.supportMeetingService.addSolution(formData).subscribe((res: any) => {
        this.utilService.showSuccessMessage('Notes added successfully!');
        this.getUserData();
        this.addSolutionForm.disable();
        this.formSubmitted = true;
      });
    } catch (error) {
      console.log(error);
    }
  }
}
