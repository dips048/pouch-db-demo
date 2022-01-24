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

  debug(componentName: string, msg: string, ...optionalParams: any[]) {
    this.componentName = componentName;
    this.writeToLog(msg, LogLevel.Debug, optionalParams);
  }

  info(componentName: string, msg: string, ...optionalParams: any[]) {
    this.componentName = componentName;
    this.writeToLog(msg, LogLevel.Info, optionalParams);
  }

  warn(componentName: string, msg: string, ...optionalParams: any[]) {
    this.componentName = componentName;
    this.writeToLog(msg, LogLevel.Warn, optionalParams);
  }

  error(componentName: string, msg: string, ...optionalParams: any[]) {
    this.componentName = componentName;
    this.writeToLog(msg, LogLevel.Error, optionalParams);
  }

  fatal(componentName: string, msg: string, ...optionalParams: any[]) {
    this.componentName = componentName;
    this.writeToLog(msg, LogLevel.Fatal, optionalParams);
  }

  log(componentName: string, msg: any, ...optionalParams: any[]) {
    this.componentName = componentName;
    this.writeToLog(msg, LogLevel.All, optionalParams);
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

  deleteLogLevel(): void {
    localStorage.removeItem('logConfig');
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

  private writeToLog(msg: string, level: LogLevel, params: any[]) {
    if(this.shouldLog(level)) {
      let entry: LogEntry = new LogEntry(new Date(), msg, level, params, this.logWithDate);
      console.log(entry.buildLogString());
      // let values: LogEntry[];
      // try {
      //   values = JSON.parse(localStorage.getItem(this.componentName)) || [];
      //   values.push(entry);
      //   localStorage.setItem(this.componentName, JSON.stringify(values));
      // }
      // catch(ex){
      //   console.log(ex);
      // }
    }
  }

}
