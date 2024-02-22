import { Router } from '@angular/router';
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DataService } from '../../../services/data.service';

@Component({
  selector: 'app-face-authentication-modal',
  templateUrl: './face-authentication-modal.component.html',
  styleUrls: ['./face-authentication-modal.component.scss'],
})
export class FaceAuthenticationModalComponent {
  constructor(
    private router: Router,
    public dataService: DataService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  redirectToDashboard() {
    this.router.navigate(['/dashboard']);
  }
  redirectToLogin() {
    this.router.navigate(['/login']);
  }
}
