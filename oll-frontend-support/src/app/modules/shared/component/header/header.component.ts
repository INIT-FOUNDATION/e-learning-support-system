import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/screens/auth/services/auth.service';
import { DataService } from '../../services/data.service';
import { Router } from '@angular/router';
import { UtilityService } from '../../services/utility.service';
import { MatDialog } from '@angular/material/dialog';
import { ProfileComponent } from '../profile/profile.component';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  constructor(
    private authService: AuthService,
    public dataService: DataService,
    private router: Router,
    public utilityService: UtilityService,
    private dialog: MatDialog
  ) {}

  userDetails: any = [];
  ngOnInit(): void {}

  goToFaceAuthentication() {
    this.router.navigate(['/face-recognization']);
  }

  logout() {
    this.authService.logout();
  }

  profileDialog() {
    let dialogRef = this.dialog.open(ProfileComponent, {
      width: '25rem',
      panelClass: [
        'animate__animated',
        'animate__slideInRight',
        'breakoutRoomPanel',
      ],
      position: { right: '0px', top: '0px', bottom: '0px' },
      disableClose: false,
    });
  }
}
