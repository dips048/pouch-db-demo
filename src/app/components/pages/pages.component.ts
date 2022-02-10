import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { WorkerService } from 'src/app/services';

@Component({
  selector: 'app-pages',
  templateUrl: './pages.component.html',
  styleUrls: ['./pages.component.scss']
})
export class PagesComponent implements OnInit {
  docs: any[]
  dbName: string;

  constructor(
    private route: ActivatedRoute,
    private workerService: WorkerService,
  ) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe((params: ParamMap) => {
        // console.log(params.get('id'))
        this.dbName = params.get('id');
        this.workerService.getAllDocIdsAndRevs(this.dbName).then(docs => {
          this.docs = docs.rows;
          // console.log(docs)
        })
        .catch(e => console.log(e));
    });
  }

}
