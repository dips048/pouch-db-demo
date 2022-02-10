import { Component, OnInit } from '@angular/core';
import { WorkerService } from 'src/app/services';

@Component({
  selector: 'app-dashboard',
  template: `
    <h3>Projects</h3>
    <ng-container *ngIf="projects">
      <div *ngFor="let project of projects">
        <div class="row">{{project.id}}</div>
        <div class="row" *ngFor="let dataSets of project.doc.dataSets">
          <app-data-set-card [dataSets]="dataSets"></app-data-set-card><br>
        </div><br>
      </div>
    </ng-container>
  `,
})
export class DashboardComponent implements OnInit {

  projects: any[];

  constructor(
    private workerService: WorkerService,
    ) { }

  ngOnInit(): void {
    this.getProject();
  }

  getProject() {
    this.workerService.getAllDocIdsAndRevs('project').then(r => {
      console.log(r);
      this.projects = r.rows;
    }).catch(e => console.log(e));
  }

}
