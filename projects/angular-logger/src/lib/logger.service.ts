import { Injectable } from '@angular/core';
import { LogLevel } from '.';
import { LogEntry } from './log-entry';

@Injectable({
  providedIn: 'root'
})
export class LoggerService {

  private level: LogLevel = LogLevel.All;
  private logWithDate: boolean = true;
  private componentName: string = 'default';

  debug(msg: string,  style = 'color: blue;', ...optionalParams: any[]) {
    this.writeToLog(msg, LogLevel.Debug, style, optionalParams);
  }

  info(msg: string, style = 'color: green;', ...optionalParams: any[]) {
    this.writeToLog(msg, LogLevel.Info, style, optionalParams);
  }

  warn(msg: string, ...optionalParams: any[]) {
    this.writeToLog(msg, LogLevel.Warn, '', optionalParams);
  }

  error(msg: string, ...optionalParams: any[]) {
    this.writeToLog(msg, LogLevel.Error, '', optionalParams);
  }

  fatal(msg: string, style = 'color: #800000;',...optionalParams: any[]) {
    this.writeToLog(msg, LogLevel.Fatal, style, optionalParams);
  }

  log(msg: any, style = 'color: brown', ...optionalParams: any[]) {
    this.writeToLog(msg, LogLevel.All, style, optionalParams);
  }

  stopTimer(label: any) {
    this.writeToLog(label, LogLevel.Diagnostic, '', null);
  }

  startTimer(label: any) {
    this.level = this.getLogLevel();
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
      let logConfig = JSON.parse(localStorage.getItem('logConfig')) ?? {};
      if(logConfig[`${this.componentName}`] !== undefined) {
        return;
      } else {
        logConfig = {...logConfig, [`${this.componentName}`]: logLevel};
        localStorage.setItem('logConfig', JSON.stringify(logConfig));
      }
    }
    catch(ex){
      console.log(ex);
    }
    console.log(this.componentName , this.constructor.name);
  }

  changeLogLevel(logLevel: LogLevel) {
    try {
      let logConfig = JSON.parse(localStorage.getItem('logConfig')) ?? {};
      logConfig = {...logConfig, [`${this.componentName}`]: logLevel};
      localStorage.setItem('logConfig', JSON.stringify(logConfig));
    }
    catch(ex){
      console.log(ex);
    }
  }

  deleteLogLevel(): void {
    // localStorage.removeItem('logConfig');
    try {
      let logConfig = JSON.parse(localStorage.getItem('logConfig')) ?? {};
      delete logConfig[`${this.componentName}`];
      localStorage.setItem('logConfig', JSON.stringify(logConfig));
    }
    catch(ex){
      console.log(ex);
    }
  }

  getLogLevel(): any {
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

  private writeToLog(msg: string, level: LogLevel, style: string, params: any[]) {
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
