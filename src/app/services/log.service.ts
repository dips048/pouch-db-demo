import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AppSettingsService } from '.';
import { LogLevel } from '../shared/enums';
import { LogConsole, LogEntry, LogLocalStorage, LogPublisher, LogPublisherConfig } from '../shared/models';

const PUBLISHERS_FILE = 'assets/log-publishers.json';

@Injectable({
  providedIn: 'root'
})
export class LogService {

  level: LogLevel = LogLevel.All;
  logWithDate: boolean = true;
  publishers: LogPublisher[] = [];

  constructor(
    private http: HttpClient,
    // private publishersService: LogPublishersService,
    private appSettingService: AppSettingsService
  ) {
      this.buildPublishers();
      // this.publishers = this.publishersService.publishers;
      this.appSettingService.getSettings().subscribe(setting => this.level = setting.logLevel);
  }

  buildPublishers(): void {
    let logPub: LogPublisher;
    this.getLoggers().subscribe(response => {
      for (const pub of response.filter(p => p.isActive)) {
        switch (pub.loggerName.toLowerCase()) {
          case 'console':
            logPub = new LogConsole();
            break;
          case 'localstorage':
            logPub = new LogLocalStorage();
            break;
        }
        // Set location, if any, of the logging
        logPub.location = pub.loggerLocation;
        this.publishers.push(logPub);
      }
    });
  }

  getLoggers(): Observable<LogPublisherConfig[]> {
    return this.http.get<LogPublisherConfig[]>(PUBLISHERS_FILE);
  }
  debug(msg: string, ...optionalParams: any[]) {
    this.writeToLog(msg, LogLevel.Debug, optionalParams);
  }

  info(msg: string, ...optionalParams: any[]) {
    this.writeToLog(msg, LogLevel.Info, optionalParams);
  }

  warn(msg: string, ...optionalParams: any[]) {
    this.writeToLog(msg, LogLevel.Warn, optionalParams);
  }

  error(msg: string, ...optionalParams: any[]) {
    this.writeToLog(msg, LogLevel.Error, optionalParams);
  }

  fatal(msg: string, ...optionalParams: any[]) {
    this.writeToLog(msg, LogLevel.Fatal, optionalParams);
  }

  log(msg: any, ...optionalParams: any[]) {
    this.writeToLog(msg, LogLevel.All, optionalParams);
  }

  clear() : void {
    for(let logger of this.publishers) {
      logger.clear();
    }
  }

  private shouldLog(level: LogLevel) : boolean {
    let ret: boolean = false;
    if(this.level !== LogLevel.Off && level >= this.level) {
      ret = true;
    }
    return ret;
  }

  private writeToLog(msg: string, level: LogLevel, params: any[]) {
    if(this.shouldLog(level)) {
      let entry: LogEntry = new LogEntry();

      entry.message = msg;
      entry.level = level;
      entry.extraInfo = params;
      entry.logWithDate = this.logWithDate;

      for (let logger of this.publishers) {
        logger.log(entry).subscribe(response => console.log(response));
      }
    }
  }

}
