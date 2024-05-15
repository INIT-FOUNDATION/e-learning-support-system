import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AppPreferencesService {
  storageKey = 'LSS';

  setValue(key: string, value: any) {
    sessionStorage.setItem(`${this.storageKey}.${key}`, JSON.stringify(value));
  }

  getValue(key: string) {
    let data = sessionStorage.getItem(`${this.storageKey}.${key}`);
    return data ? data : null;
  }

  removeKey(key: string) {
    sessionStorage.removeItem(`${this.storageKey}.${key}`);
  }

  clearAll() {
    sessionStorage.clear();
  }
}
