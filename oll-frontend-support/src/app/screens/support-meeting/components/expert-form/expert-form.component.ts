import { Component, Input, OnInit, TemplateRef } from '@angular/core';
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
  historyFormArray: any = [
    {
      id: 1,
      name: 'Shubham Baranwal',
      date: '1 May, 2024',
      note: 'This is a test note.',
      solution: 'Solution provided.',
      transcript: [
        {
          name: 'OLL Support(Rahul):',
          desc: "Hi Shubham Baranwal, I see you're having trouble with your JavaScript code. What seems to be the issue?",
        },
        {
          name: 'Shubham Baranwal:',
          desc: "Hi Rahul, yes, I'm trying to create a function that sorts an array of numbers in ascending order, but I keep getting an error.",
        },
        {
          name: 'OLL Support (Rahul):',
          desc: "Okay, let's take a look at your code. Could you share it with me?",
        },

        {
          name: 'OLL Support (Rahul):',
          desc: "Alright, I see what you're trying to do here. It looks like you're on the right track. Let's go through your code step by step. First, you've defined a function called sortArray.",
        },
        {
          name: 'Shubham Baranwal:',
          desc: "Yes, that's right. I'm passing an array called numbers to it.",
        },
        {
          name: 'OLL Support (Rahul):',
          desc: "Here's how you can implement the comparison function. Inside the parentheses of the sort() method, you can define a function that takes two parameters, a and b, representing two elements of the array. Then, you can subtract b from a. If the result is negative, it means a should come before b in the sorted array.",
        },
        {
          name: 'Shubham Baranwal:',
          desc: ' That makes sense. So, if a is less than b, the result will be negative, and a will come before b in the sorted array.',
        },
        {
          name: 'OLL Support (Rahul):',
          desc: "Exactly. Now, let's integrate this comparison function into your code.",
        },

        { name: 'Shubham Baranwal:', desc: ' Like this?' },
        {
          name: 'OLL Support (Rahul):',
          desc: "Yes, that's it! Now try running your code again with a test array and see if it sorts the numbers correctly.",
        },

        {
          name: 'Shubham Baranwal:',
          desc: ' It works! The numbers are now sorted in ascending order. Thank you so much, Rahul!',
        },
        {
          name: 'OLL Support (Rahul):',
          desc: " You're welcome, Shubham Baranwal. Remember, JavaScript's sort() method can be tricky, but once you understand how to use comparison functions, you'll be able to sort arrays effortlessly. If you have any more questions or need further assistance, feel free to ask.",
        },
        {
          name: 'OLL Support(Rahul):',
          desc: "Hi Shubham Baranwal, I see you're having trouble with your JavaScript code. What seems to be the issue?",
        },
        {
          name: 'Shubham Baranwal:',
          desc: "Hi Rahul, yes, I'm trying to create a function that sorts an array of numbers in ascending order, but I keep getting an error.",
        },
        {
          name: 'OLL Support (Rahul):',
          desc: "Okay, let's take a look at your code. Could you share it with me?",
        },

        {
          name: 'OLL Support (Rahul):',
          desc: "Alright, I see what you're trying to do here. It looks like you're on the right track. Let's go through your code step by step. First, you've defined a function called sortArray.",
        },
        {
          name: 'Shubham Baranwal:',
          desc: "Yes, that's right. I'm passing an array called numbers to it.",
        },
        {
          name: 'OLL Support (Rahul):',
          desc: "Here's how you can implement the comparison function. Inside the parentheses of the sort() method, you can define a function that takes two parameters, a and b, representing two elements of the array. Then, you can subtract b from a. If the result is negative, it means a should come before b in the sorted array.",
        },
        {
          name: 'Shubham Baranwal:',
          desc: ' That makes sense. So, if a is less than b, the result will be negative, and a will come before b in the sorted array.',
        },
        {
          name: 'OLL Support (Rahul):',
          desc: "Exactly. Now, let's integrate this comparison function into your code.",
        },

        { name: 'Shubham Baranwal:', desc: ' Like this?' },
        {
          name: 'OLL Support (Rahul):',
          desc: "Yes, that's it! Now try running your code again with a test array and see if it sorts the numbers correctly.",
        },

        {
          name: 'Shubham Baranwal:',
          desc: ' It works! The numbers are now sorted in ascending order. Thank you so much, Rahul!',
        },
        {
          name: 'OLL Support (Rahul):',
          desc: " You're welcome, Shubham Baranwal. Remember, JavaScript's sort() method can be tricky, but once you understand how to use comparison functions, you'll be able to sort arrays effortlessly. If you have any more questions or need further assistance, feel free to ask.",
        },
      ],
    },
    {
      id: 2,
      name: 'Shubham Baranwal',
      date: '6 May, 2024',
      note: 'Discussed about javascript.',
      solution: 'Solution given.',
      transcript: [
        {
          name: 'OLL Support(Rahul):',
          desc: 'Hi',
        },
        {
          name: 'Shubham Baranwal:',
          desc: 'Hi Rahul, I am testing.',
        },
      ],
    },
    {
      id: 3,
      name: 'Shubham Baranwal',
      date: '10 May, 2024',
      note: 'Unable to use the sort array function to sort in ascending order',
      solution:
        'Knowledge of comparison functions was required in order to get the desired results.',
      transcript: [
        {
          name: 'OLL Support(Rahul):',
          desc: "Hi Shubham Baranwal, I see you're having trouble with your JavaScript code. What seems to be the issue?",
        },
        {
          name: 'Shubham Baranwal:',
          desc: "Hi Rahul, yes, I'm trying to create a function that sorts an array of numbers in ascending order, but I keep getting an error.",
        },
        {
          name: 'OLL Support (Rahul):',
          desc: "Okay, let's take a look at your code. Could you share it with me?",
        },

        {
          name: 'OLL Support (Rahul):',
          desc: "Alright, I see what you're trying to do here. It looks like you're on the right track. Let's go through your code step by step. First, you've defined a function called sortArray.",
        },
        {
          name: 'Shubham Baranwal:',
          desc: "Yes, that's right. I'm passing an array called numbers to it.",
        },
        {
          name: 'OLL Support (Rahul):',
          desc: "Here's how you can implement the comparison function. Inside the parentheses of the sort() method, you can define a function that takes two parameters, a and b, representing two elements of the array. Then, you can subtract b from a. If the result is negative, it means a should come before b in the sorted array.",
        },
        {
          name: 'Shubham Baranwal:',
          desc: ' That makes sense. So, if a is less than b, the result will be negative, and a will come before b in the sorted array.',
        },
        {
          name: 'OLL Support (Rahul):',
          desc: "Exactly. Now, let's integrate this comparison function into your code.",
        },

        { name: 'Shubham Baranwal:', desc: ' Like this?' },
        {
          name: 'OLL Support (Rahul):',
          desc: "Yes, that's it! Now try running your code again with a test array and see if it sorts the numbers correctly.",
        },

        {
          name: 'Shubham Baranwal:',
          desc: ' It works! The numbers are now sorted in ascending order. Thank you so much, Rahul!',
        },
        {
          name: 'OLL Support (Rahul):',
          desc: " You're welcome, Shubham Baranwal. Remember, JavaScript's sort() method can be tricky, but once you understand how to use comparison functions, you'll be able to sort arrays effortlessly. If you have any more questions or need further assistance, feel free to ask.",
        },
      ],
    },
  ];
  currentIndex: number = this.historyFormArray.length - 1;
  showTranscription: boolean = false;
  constructor(
    public dialog: MatDialog,
    private supportMeetingService: SupportMeetingService,
    private utilService: UtilityService
  ) {}

  ngOnInit(): void {
    console.log(this.requestDetailsFromParent);

    this.initForm();
    this.getUserData();
  }

  initForm() {
    this.userLoginDetailsForm = new FormGroup({
      name: new FormControl(null, [Validators.required]),
      issues: new FormControl(null),
    });

    this.addSolutionForm = new FormGroup({
      solutionSuggested: new FormControl(null),
      requestId: new FormControl(this.requestDetailsFromParent?.requestId),
      notes: new FormControl(null),
    });
  }

  showPreviousData() {
    if (this.currentIndex > 0) {
      this.currentIndex--;
    }
  }

  showNextData() {
    if (this.currentIndex < this.historyFormArray.length - 1) {
      this.currentIndex++;
    }
  }

  get currentData() {
    return this.historyFormArray[this.currentIndex];
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
          console.log(res);
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
      });
    } catch (error) {
      console.log(error);
    }
  }
}
