import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class TrexGameService {
  constructor(private http: HttpClient) {}

  joinUser(payload): Observable<any> {
    return this.http.post(
      `${environment.support_system_prefix}/joinUser`,
      payload
    );
  }
}
