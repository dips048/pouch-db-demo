import { Injectable } from '@angular/core';
import { LogConsole, LogLocalStorage, LogPublisher } from '../shared/models';

@Injectable({
  providedIn: 'root'
})
export class LogPublishersService {

  publishers: LogPublisher[] = [];

  constructor() {
    this.buildPublishers();
  }

  buildPublishers(): void {
    this.publishers.push(new LogConsole());
    this.publishers.push(new LogLocalStorage());
  }
}
