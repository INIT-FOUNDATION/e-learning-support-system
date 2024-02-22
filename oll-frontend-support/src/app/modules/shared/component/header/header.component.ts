import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/screens/auth/services/auth.service';
import { DataService } from '../../services/data.service';
import { Router } from '@angular/router';
import { UtilityService } from '../../services/utility.service';

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
    public utilityService: UtilityService
  ) {}
  userDetails: any = [];
  ngOnInit(): void {}

  goToFaceAuthentication() {
    this.router.navigate(['/face-recognization']);
  }

  logout() {
    this.authService.logout();
  }
}
