//   import { HttpClient } from '@angular/common/http';
// import { Injectable } from '@angular/core';
// import { Observable } from 'rxjs';
// import { LogConsole, LogLocalStorage, LogPublisher, LogPublisherConfig } from '../shared/models';

// const PUBLISHERS_FILE = 'assets/log-publishers.json';

// @Injectable({
//   providedIn: 'root'
// })
// export class LogPublishersService {

//   publishers: LogPublisher[] = [];

//   constructor(private http: HttpClient) {
//     this.buildPublishers();
//   }

//   buildPublishers(): void {
//     let logPub: LogPublisher;

//     this.getLoggers().subscribe(response => {
//       for (const pub of response.filter(p => p.isActive)) {
//         switch (pub.loggerName.toLowerCase()) {
//           case 'console':
//             logPub = new LogConsole();
//             break;
//           case 'localstorage':
//             logPub = new LogLocalStorage();
//             break;
//         }

//         // Set location, if any, of the logging
//         logPub.location = pub.loggerLocation;
//         // Add publisher to array
//         this.publishers.push(logPub);
//       }
//     });
//   }

//   getLoggers(): Observable<LogPublisherConfig[]> {
//     return this.http.get<LogPublisherConfig[]>(PUBLISHERS_FILE);
//   }

// }
