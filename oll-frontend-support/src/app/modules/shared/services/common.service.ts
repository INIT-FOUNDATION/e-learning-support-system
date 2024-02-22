import { Injectable } from '@angular/core';
import { AuthService } from 'src/app/screens/auth/services/auth.service';
import { AppPreferencesService } from './app-preferences.service';
import { DataService } from './data.service';

@Injectable({
  providedIn: 'root',
})
export class CommonService {
  constructor(
    private authService: AuthService,
    private appPreferences: AppPreferencesService,
    private dataService: DataService
  ) {}

  async getUserDetails(res: {token: string, redirect: boolean}) {
    this.authService.currentUserSubject.next(res);
    let userDetails: any = await this.authService.getUserDetails().toPromise();

    this.appPreferences.setValue(
      'oll_user_details',
      JSON.stringify(userDetails.data)
    );
    this.dataService.userDetails = userDetails.data;
  }
}
