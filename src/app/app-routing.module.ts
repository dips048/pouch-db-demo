import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { LogTestComponent } from './components/log-test/log-test.component';
import { PdfViewerComponent } from './components/pdf-viewer/pdf-viewer.component';
import { PouchDbInteractionComponent } from './components/pouch-db-interaction/pouch-db-interaction.component';
import { SettingsComponent } from './components/settings/settings.component';
import { TestComponent } from './components/test/test.component';


const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: '**', redirectTo: 'dashboard' },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'pouch-db-int', component: PouchDbInteractionComponent },
  { path: 'pdf-viewer', component: PdfViewerComponent },
  { path: 'log-test', component: LogTestComponent },
  { path: 'test', component: TestComponent },
  { path: 'setting', component: SettingsComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
