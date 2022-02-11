import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { components } from './components';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { AppRoutingModule } from './app-routing.module';
import { AngularLoggerModule } from '@dips048/angular-logger';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { NgCircleProgressModule } from 'ng-circle-progress';
import { ProgressBarModule } from 'angular-progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { DBModule } from './shared/modules/indexed-db-module';

// let schema = {
//   version: 1,
//   name: 'MyDB',
//   stores: {
//     ['footer']: {
//       primaryKey: 'footerCache'
//     }
//   }
// };
@NgModule({
  declarations: [
    AppComponent,
    ...components,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    PdfViewerModule,
    AngularLoggerModule,
    BrowserAnimationsModule,
    MatCardModule,
    MatButtonModule,
    MatProgressBarModule,
    NgCircleProgressModule.forRoot({
      radius: 100,
      outerStrokeWidth: 16,
      innerStrokeWidth: 8,
      outerStrokeColor: "#78C000",
      innerStrokeColor: "#C7E596",
      animationDuration: 300,
    }),
    ProgressBarModule,
    MatProgressSpinnerModule,
    // DBModule.provideDB(schema)
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
