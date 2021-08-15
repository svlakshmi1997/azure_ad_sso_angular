import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class GetSubscriptionsService {
  constructor(
    private http: HttpClient
  ) { }

  /* Call Get Subscriptions - List Rest API */
  getSubscription(accessToken) {
    let httpHeaders = new HttpHeaders({ 'Authorization': 'Bearer ' + accessToken });
    let httpOptions = { headers: httpHeaders };

    let url = "https://management.azure.com/subscriptions?api-version=2019-06-01";
    return this.http.get(url, httpOptions).pipe(map((response: Response) => response));
  }
}
