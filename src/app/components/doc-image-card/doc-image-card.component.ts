import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { WorkerService } from 'src/app/services';

@Component({
  selector: 'app-doc-image-card',
  template: `
    <div class="row">
      <div class="column small-2">{{docImageId}}</div>
      <div class="column small-2">Total Pages: {{totalPages}}</div>
      <div class="column small-2">completed: {{(addedPages/totalPages)*100 | number:'2.0-2'}}%</div>
      <div class="column small-4">
        <mat-progress-bar
          class="example"
          [color]="'primary'"
          [mode]="'determinate'"
          [value]="(addedPages/totalPages)*100">
        </mat-progress-bar>
      </div>
    </div>
  `,
  styles:[`
    .example {
      display: flex;
      align-content: center;
      align-items: center;
      height: 10px;
    }
  `],
})
export class DocImageCardComponent implements OnInit {

  @Input() docImageId: string;
  @Input() totalPages: number;
  @Output() pages: EventEmitter<number> = new EventEmitter<number>();
  addedPages = 0;

  constructor(
    private workerService: WorkerService,
    ) { }

  ngOnInit(): void {
    this.getDocuments(this.docImageId);
  }

  getDocuments(id: string) {
    this.workerService.getAllDocIdsAndRevs(id).then(r => {
      // console.log(r);
      this.addedPages = r.total_rows;
      this.pages.emit(r.total_rows);
    }).catch(e => console.log(e));
  }

}
