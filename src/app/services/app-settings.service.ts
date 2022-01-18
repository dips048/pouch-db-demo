import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, tap } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { AppSettings } from '../shared/models';

const SETTINGS_LOCATION = "assets/app-settings.json";
const SETTINGS_KEY = "configuration";

@Injectable({
  providedIn: 'root'
})
export class AppSettingsService {

  constructor(private http: HttpClient) { }

  getSettings(): Observable<AppSettings> {
    let settings = localStorage.getItem(SETTINGS_KEY);
    if (settings) {
      return of(JSON.parse(settings));
    }
    else {
      return this.http.get<AppSettings>(SETTINGS_LOCATION).pipe(
        tap(settings => {
          if (settings) {
            this.saveSettings(settings);
          }
        }),
        catchError(
          this.handleError<AppSettings>('getSettings', new AppSettings()))
      );
    }
  }

  saveSettings(settings: AppSettings) {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  }

  deleteSettings(): void {
    localStorage.removeItem(SETTINGS_KEY);
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      // Log the error to the console
      switch (error.status) {
        case 404:
          console.error("Can't find file: " +
              SETTINGS_LOCATION);
          break;
        default:
          console.error(error);
          break;
      }
      // Return default configuration values
      return of(result as T);
    };
  }
}
