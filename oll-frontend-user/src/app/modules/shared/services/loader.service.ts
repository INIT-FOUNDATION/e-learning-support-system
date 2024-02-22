import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class LoaderService {
  loaderSubject: BehaviorSubject<any>;
  isLoading: BehaviorSubject<boolean> = new BehaviorSubject(false);
  loader$: Observable<any>;
  loader_obj = {};
  constructor() {
    this.loaderSubject = new BehaviorSubject<any>(null);
    this.loader$ = this.loaderSubject.asObservable();
  }
}
