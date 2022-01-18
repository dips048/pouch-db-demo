import { Injectable } from '@angular/core';
import { AppSettingsService, LogPublishersService } from '.';
import { LogLevel } from '../shared/enums';
import { LogEntry, LogPublisher } from '../shared/models';

@Injectable({
  providedIn: 'root'
})
export class LogService {

  level: LogLevel = LogLevel.All;
  logWithDate: boolean = true;
  publishers: LogPublisher[];

  constructor(
    private publishersService: LogPublishersService,
    private appSettingService: AppSettingsService
    ) {
    this.publishers = this.publishersService.publishers;
    this.appSettingService.getSettings().subscribe(setting => this.level = setting.logLevel);
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
