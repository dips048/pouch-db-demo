import { Component, OnInit } from '@angular/core';
import { AppSettings } from '../../shared/models';
import { AppSettingsService, } from '../../services';
import { AngularLoggerService } from 'angular-logger';

@Component({
  selector: 'app-settings',
  templateUrl: 'settings.component.html',
})

export class SettingsComponent implements OnInit {
  settings: AppSettings;

  constructor(
    private appSettingsService: AppSettingsService,
    private logger: AngularLoggerService
  ) {}

  testLog() {
    this.logger.log('test log');
    this.logger.warn('warning');
    this.logger.debug('debug');
    this.logger.error('error');
    this.logger.info('info');
    this.logger.fatal('fatal');
  }

  ngOnInit(): void {
    this.appSettingsService.getSettings()
      .subscribe(settings => this.settings = settings);
  }

  saveSettings(): void {
    this.appSettingsService.saveSettings(this.settings);
  }

  deleteSettings(): void {
    this.appSettingsService.deleteSettings();
  }
}
