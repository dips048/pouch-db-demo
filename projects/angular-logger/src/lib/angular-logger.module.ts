import { ModuleWithProviders, NgModule } from '@angular/core';
import { AngularLoggerComponent } from './angular-logger.component';
import { LoggerConfig } from './logger.config';



@NgModule({
  declarations: [
    AngularLoggerComponent
  ],
  imports: [
  ],
  exports: [
    AngularLoggerComponent,
  ],
})
export class AngularLoggerModule {
  public static forRoot(configuration: Partial<LoggerConfig>): ModuleWithProviders<AngularLoggerModule> {
    return {
      ngModule: AngularLoggerModule,
      providers: [
        {
          provide: LoggerConfig,
          useValue: configuration,
        }
      ]
    }
  }
 }
