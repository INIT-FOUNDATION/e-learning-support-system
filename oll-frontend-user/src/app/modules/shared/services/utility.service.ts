import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UtilityService {
  private showHeader: BehaviorSubject<boolean>;
  showHeader$: Observable<boolean>;

  private showFooter: BehaviorSubject<boolean>;
  showFooter$: Observable<boolean>;

  private showPadding: BehaviorSubject<boolean>;
  showPadding$: Observable<boolean>;

  constructor(private toasterService: ToastrService) {
    this.showHeader = new BehaviorSubject(true);
    this.showHeader$ = this.showHeader.asObservable();

    this.showPadding = new BehaviorSubject(true);
    this.showPadding$ = this.showPadding.asObservable();

    this.showFooter = new BehaviorSubject(true);
    this.showFooter$ = this.showHeader.asObservable();
  }

  set showHeaderSet(flag) {
    this.showHeader.next(flag);
  }

  set showFooterSet(flag) {
    this.showFooter.next(flag);
  }

  set showPaddingSet(flag) {
    this.showPadding.next(flag);
  }

  showSuccessMessage(msg) {
    this.toasterService.success(msg);
  }

  showErrorMessage(msg) {
    this.toasterService.error(msg);
  }

  showInfoMessage(msg) {
    this.toasterService.info(msg);
  }

  b64toBlob = (b64Data, contentType = '', sliceSize = 512) => {
    const byteCharacters = atob(b64Data);
    const byteArrays = [];

    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      const slice = byteCharacters.slice(offset, offset + sliceSize);

      const byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }

      const byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }

    const blob = new Blob(byteArrays, { type: contentType });
    return blob;
  };
}
