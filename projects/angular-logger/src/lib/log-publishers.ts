import { Observable, of } from 'rxjs';
import { LogEntry } from './log-entry';

export abstract class LogPublisher {
  location: string;

  abstract log(record: LogEntry) : Observable<boolean>;
  abstract clear() : Observable<boolean>;
}

export class LogConsole extends LogPublisher {

  log(record: LogEntry) : Observable<boolean>{
    console.log(record.buildLogString());
    return of(true);
  }

  clear() : Observable<boolean> {
    console.clear();
    return of(true);
  }
}

export class LogLocalStorage extends LogPublisher {
  constructor() {
    super();
    this.location = "logging";
  }

  getAll(location): Observable<LogEntry[]> {
    let values: LogEntry[];
    if(location) {
      values = JSON.parse(localStorage.getItem(location)) || [];
    } else {
      values = JSON.parse(localStorage.getItem(this.location)) || [];
    }
    return of(values);
  }

  log(record: LogEntry): Observable<boolean> {
    let ret: boolean = false;
    let values: LogEntry[];
    try {
      values = JSON.parse(localStorage.getItem(this.location)) || [];
      values.push(record);
      localStorage.setItem(this.location, JSON.stringify(values));
      ret = true;
    }
    catch(ex){
      console.log(ex);
    }
    return of(ret);
  }

  clear(): Observable<boolean> {
    localStorage.removeItem(this.location);
    return of(true);
  }
}

export class LogPublisherConfig {
  loggerName: string;
  loggerLocation: string;
  isActive: boolean;
}
