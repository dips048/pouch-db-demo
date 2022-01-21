import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { LogEntry } from './log-entry';
import { LogLevel } from './log-level';
import { LogConsole, LogLocalStorage, LogPublisher } from './log-publishers';
import { LoggerConfig } from './logger.config';

const PUBLISHERS_FILE = 'assets/log-publishers.json';

@Injectable({
  providedIn: 'root'
})
export class AngularLoggerService {

  level: LogLevel = LogLevel.All;
  logWithDate: boolean = true;
  publishers: LogPublisher[] = [];

  constructor(
    private loggerConfig: LoggerConfig,
  ) {
      this.level = loggerConfig.level;
      this.buildPublishers();
  }


  buildPublishers(): void {
    // Create an instance of the LogConsole class
    this.publishers.push(new LogConsole());
    // Create an instance of the LogLocalStorage class
    this.publishers.push(new LogLocalStorage());
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
    this.level = this.getLogLevel();
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

  getLogLevel(): LogLevel {
    let logLevel = localStorage.getItem('logLevel');
    if (logLevel) {
      return JSON.parse(logLevel).level;
    }
    else {
      this.saveLogLevel({level: this.loggerConfig.level})
      return this.loggerConfig.level;
    }
  }

  saveLogLevel(logLevel) {
    localStorage.setItem('logLevel', JSON.stringify(logLevel));
  }

  deleteLogLevel(): void {
    localStorage.removeItem('logLevel');
  }

  getAll(location = 'logging'): Observable<LogEntry[]> {
    const logLocalStorage = new LogLocalStorage();
    return logLocalStorage.getAll(location);
  }
}
