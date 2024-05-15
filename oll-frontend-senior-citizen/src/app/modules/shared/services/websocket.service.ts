import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { io } from 'socket.io-client';

@Injectable({
  providedIn: 'root',
})
export class WebsocketService {
  private lssWebSocket: any;
  constructor() {
    this.connect();
  }

  connect() {
    try {
      this.lssWebSocket = io(
        `${environment.lss_websocket_url}`,
        { transports: ['websocket'], forceNew: true }
      ).connect();
    } catch (err) {
      console.log(err);
    }
  }

  listen(eventName: string) {
    return new Observable((subscriber) => {
      this.lssWebSocket.on(eventName, (data: any) => {
        subscriber.next(data);
      });
    });
  }

  emit(eventName: string, data: any) {
    this.lssWebSocket.emit(eventName, data);
  }

  disconnect() {
    if (this.lssWebSocket) {
      try {
        this.lssWebSocket.disconnect();
      } catch (error) {
        console.log(error);
      }
    }
  }
}
