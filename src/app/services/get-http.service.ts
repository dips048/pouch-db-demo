import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Page } from '../shared/models';
import { TokenModel } from '../tokens.model';

@Injectable({
  providedIn: 'root'
})
export class GetHttpService {

  constructor(private http: HttpClient) { }

  getTokensData(): Observable<TokenModel[]> {
    return this.http.get<TokenModel[]>('/assets/tokens.json');
  }

  getPagesData(): Observable<HttpResponse<Page[]>> {
    return this.http.get<Page[]>('/assets/pages-id.json',{observe: 'response'});
  }

  async storage(required = 10) {
    if (!navigator.storage) return;
    const estimate = await navigator.storage.estimate(),
    // calculate remaining storage in MB
    available = Math.floor((estimate.quota - estimate.usage) / 1024 / 1024);
    if (available >= required) {
      console.log('Storage is available');
      // ...call functions to initialize IndexedDB
    } else {
      console.log('Storage is unAvailable');
    }
  }
}
