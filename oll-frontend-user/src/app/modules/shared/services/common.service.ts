import { Injectable } from '@angular/core';
import { AppPreferencesService } from './app-preferences.service';
import { DataService } from './data.service';

@Injectable({
  providedIn: 'root',
})
export class CommonService {
  constructor(
    private appPreferences: AppPreferencesService,
    private dataService: DataService
  ) {}

  async getUserDetails(res: { token: string; redirect: boolean }) {}
}
