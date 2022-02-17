import { Injectable } from '@angular/core';
import { LogEntry } from './log-entry';

export enum LogLevel {
  All = 0,
  Debug = 1,
  Info = 2,
  Warn = 3,
  Error = 4,
  Fatal = 5,
  Diagnostic = 6,
  Off = 7
}

// @Injectable({
//   providedIn: 'root'
// })
@Injectable()
export class LoggerService {

  level: LogLevel = LogLevel.All;
  logWithDate: boolean = true;
  componentName: string = 'default';

  debug(msg: string,  style = 'color: blue;', ...optionalParams: any[]) {
    this.writeToLog(msg, LogLevel.Debug, style, optionalParams);
  }

  info(msg: string, style = 'color: green;', ...optionalParams: any[]) {
    this.writeToLog(msg, LogLevel.Info, style, optionalParams);
  }

  warn(msg: string, style = 'color: #FFCC00;', ...optionalParams: any[]) {
    this.writeToLog(msg, LogLevel.Warn, style, optionalParams);
  }

  error(msg: string, style = 'color: #D8000C;', ...optionalParams: any[]) {
    this.writeToLog(msg, LogLevel.Error, style, optionalParams);
  }

  fatal(msg: string, style = 'color: #800000;',...optionalParams: any[]) {
    this.writeToLog(msg, LogLevel.Fatal, style, optionalParams);
  }

  log(msg: any, style = 'color: brown', ...optionalParams: any[]) {
    const a = console.trace();
    console.log('a',a);
    this.writeToLog(msg, LogLevel.All, style, optionalParams);
  }

  stopTimer(label: any, style = 'color: #800080;', ...optionalParams: any[]) {
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
      if(logConfig[`${this.componentName}`]) {
        return;
      }
      logConfig = {...logConfig, [`${this.componentName}`]: logLevel};
      localStorage.setItem('logConfig', JSON.stringify(logConfig));
    }
    catch(ex){
      console.log(ex);
    }
    console.log(this.componentName , this.constructor.name);
  }

  changeLogLevel(logLevel: LogLevel) {
    try {
      let logConfig = JSON.parse(localStorage.getItem('logConfig')) || [];
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
