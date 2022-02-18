import { Component, Inject, OnInit } from '@angular/core';
import { AppSettings } from '../../shared/models';
import { AppSettingsService, } from '../../services';
import { LoggerService } from '@dips048/angular-logger';

@Component({
  selector: 'app-settings',
  templateUrl: 'settings.component.html',
})

export class SettingsComponent implements OnInit {
  settings: AppSettings;

  constructor(
    private appSettingsService: AppSettingsService,
    private logger: LoggerService
  ) {
    this.logger.registerComponent(this.constructor.name);
  }

  testLog() {
    this.logger.log(this.constructor.name, 'test log');
    this.logger.warn(this.constructor.name, 'warning');
    this.logger.debug(this.constructor.name, 'debug');
    this.logger.error(this.constructor.name, 'error');
    this.logger.info(this.constructor.name, 'info');
    this.logger.fatal(this.constructor.name, 'fatal');
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
