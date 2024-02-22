import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor(private http: HttpClient) { }

  requestPermission(): void {
    if ('Notification' in window) {
      Notification.requestPermission().then(permission => {
        console.log('Notification permission:', permission);
      });
    }
  }

  showNotification(title: string, options?: NotificationOptions): void {
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(title, options).addEventListener('click', (ev) => {
        const notification: any = ev.currentTarget;
        const data = notification.data;
        const url = `${environment.lss_web_url}/dashboard`;
        window.open(url, 'oll');
      });
    }
  }

  getAudio(): Observable<ArrayBuffer> {
    return this.http.get('/assets/audio/notification.mp3', { responseType: 'arraybuffer' });
  }
}
