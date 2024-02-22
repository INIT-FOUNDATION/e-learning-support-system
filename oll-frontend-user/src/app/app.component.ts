import { Component, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import { AppPreferencesService } from './modules/shared/services/app-preferences.service';
import { DataService } from './modules/shared/services/data.service';
import { Location } from '@angular/common';
import { UtilityService } from './modules/shared/services/utility.service';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'lss-frontend-admin';
  constructor(
    private router: Router,
    private appPreferences: AppPreferencesService,
    private dataService: DataService,
    private location: Location,
    public utilityService: UtilityService
  ) {}

  ngOnInit(): void {}
}
