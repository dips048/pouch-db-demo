import { Component, OnInit } from '@angular/core';
import { AppSettings } from '../../shared/models';
import { AppSettingsService } from '../../services';

@Component({
  selector: 'app-settings',
  templateUrl: 'settings.component.html'
})

export class SettingsComponent implements OnInit {
  constructor(private appSettingsService: AppSettingsService) {
  }

  settings: AppSettings;

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
