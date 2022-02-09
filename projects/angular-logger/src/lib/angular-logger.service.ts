import { Injectable } from '@angular/core';
import { LogLevel } from '.';
import { LogEntry } from './log-entry';


@Injectable({
  providedIn: 'root'
})
export class AngularLoggerService {

  level: LogLevel = LogLevel.All;
  logWithDate: boolean = true;
  componentName: string = 'default';

  constructor() {
    this.changeLogLevel(this.componentName, LogLevel.All);
  }

  debug(componentName: string, msg: string,  style = 'color: blue;', ...optionalParams: any[]) {
    this.componentName = componentName;
    this.writeToLog(msg, LogLevel.Debug, style, optionalParams);
  }

  info(componentName: string, msg: string, style = 'color: green;', ...optionalParams: any[]) {
    this.componentName = componentName;
    this.writeToLog(msg, LogLevel.Info, style, optionalParams);
  }

  warn(componentName: string, msg: string, style = 'color: #FFCC00;', ...optionalParams: any[]) {
    this.componentName = componentName;
    this.writeToLog(msg, LogLevel.Warn, style, optionalParams);
  }

  error(componentName: string, msg: string, style = 'color: #D8000C;', ...optionalParams: any[]) {
    this.componentName = componentName;
    this.writeToLog(msg, LogLevel.Error, style, optionalParams);
  }

  fatal(componentName: string, msg: string, style = 'color: #800000;',...optionalParams: any[]) {
    this.componentName = componentName;
    this.writeToLog(msg, LogLevel.Fatal, style, optionalParams);
  }

  log(componentName: string, msg: any, style = '', ...optionalParams: any[]) {
    this.componentName = componentName;
    this.writeToLog(msg, LogLevel.All, style, optionalParams);
  }

  stopTimer(componentName: string, label: any, style = 'color: #800080;', ...optionalParams: any[]) {
    this.componentName = componentName;
    this.writeToLog(label, LogLevel.Diagnostic, style, optionalParams);
  }

  startTimer(label: any) {
    if(this.level !== LogLevel.Off && LogLevel.Diagnostic >= this.level) {
      console.time(label);
    }
  }

  clear() {
    console.clear();
  }

  registerComponent(componentName: string, logLevel: LogLevel = LogLevel.Off) {
    this.componentName = componentName;
    try {
      let logConfig = JSON.parse(localStorage.getItem('logConfig')) || [];
      if(logConfig[`${this.componentName}`]) { return; }
      logConfig = {...logConfig, [`${this.componentName}`]: logLevel};
      localStorage.setItem('logConfig', JSON.stringify(logConfig));
    }
    catch(ex){
      console.log(ex);
    }
  }

  changeLogLevel(componentName: string, logLevel: LogLevel) {
    this.componentName = componentName;
    try {
      let logConfig = JSON.parse(localStorage.getItem('logConfig')) || [];
      logConfig = {...logConfig, [`${this.componentName}`]: logLevel};
      localStorage.setItem('logConfig', JSON.stringify(logConfig));
    }
    catch(ex){
      console.log(ex);
    }
  }

  deleteLogLevel(componentName: string): void {
    this.componentName = componentName;
    // localStorage.removeItem('logConfig');
    try {
      let logConfig = JSON.parse(localStorage.getItem('logConfig')) || [];
      logConfig = {...logConfig, [`${this.componentName}`]: null};
      localStorage.setItem('logConfig', JSON.stringify(logConfig));
    }
    catch(ex){
      console.log(ex);
    }
  }

  private getLogLevel(): any {
    let logConfig = JSON.parse(localStorage.getItem('logConfig'));
    if (logConfig && logConfig[`${this.componentName}`]) {
      return logConfig[`${this.componentName}`];
    }
    else {
      return this.level;
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

  private writeToLog(msg: string, level: LogLevel, style: any, params: any[]) {
    if(this.shouldLog(level)) {
      let entry: LogEntry = new LogEntry(new Date(), msg, level, params, this.logWithDate);
      switch (level) {
        case LogLevel.All: {
          console.log(`%c ${entry.buildLogString()}`, style);
          break;
        }
        case LogLevel.Fatal: {
          console.log(`%c ${entry.buildLogString()}`, style);
          break;
        }
        case LogLevel.Debug: {
          console.log(`%c ${entry.buildLogString()}`, style);
          break;
        }
        case LogLevel.Info: {
          console.log(`%c ${entry.buildLogString()}`, style);
          break;
        }
        case LogLevel.Warn: {
          console.warn(entry.buildLogString());
          break;
        }
        case LogLevel.Error: {
          console.error(entry.buildLogString());
          break;
        }
        case LogLevel.Diagnostic: {
          console.timeEnd(msg);
          break;
        }
      }
    }
  }

}
