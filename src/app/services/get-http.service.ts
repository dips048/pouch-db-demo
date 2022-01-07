import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { TokenModel } from '../tokens.model';

@Injectable({
  providedIn: 'root'
})
export class GetHttpService {

  constructor(private http: HttpClient) { }

  getTokensData(): Observable<TokenModel[]> {
    return this.http.get<TokenModel[]>('/assets/tokens.json');
  }

  getPagesData(): Observable<any> {
    return this.http.get('/assets/pages.json');
  }
}
