import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  private _userDetails: any;
  private userDataSubject: BehaviorSubject<any>;
  public userData: Observable<any>;
  constructor() {
    this.userDataSubject = new BehaviorSubject<any>(null);
    this.userData = this.userDataSubject.asObservable();
  }

  get userDetails() {
    return this._userDetails;
  }

  set userDetails(userDetails) {
    this._userDetails = { ...this._userDetails, ...userDetails };
    this.userDataSubject.next(this._userDetails);
  }
}
