import { Component, OnInit } from '@angular/core';
import { map, Observable } from 'rxjs';
import { GetHttpService } from 'src/app/services/get-http.service';
import { DataSet, Page } from 'src/app/shared/models';
import { DatabaseService } from '../../services/database.service';
import { IdbService } from '../../services/idb.service';

@Component({
  selector: 'app-database-test',
  templateUrl: './database-test.component.html',
  styleUrls: ['./database-test.component.scss']
})
export class DatabaseTestComponent implements OnInit {
  dbId: string = 'dbName1';
  pages$: Observable<Page[]>;
  counter = 0;
  totalPages = 300;
  projectName = 'project-1';
  dataSetName = 'data-set-1';
  // docs$: Observable<any>;

  constructor(
    private getHttpService: GetHttpService,
    private databseService: DatabaseService,
    private idbService: IdbService
  ) { }

  ngOnInit(): void {
    this.pages$ = this.getHttpService.getPagesData().pipe(map(response => response.body.map(r => ({...r, id: r._id}))));
    // this.databseService.openDb(`doc-images-${this.dbId}`, this.dbId).subscribe(r => console.log(r));
    // this.getDocs();
    // this.idbService.connectToIDB().subscribe(r => console.log(r));
  }

  generateDbId() {
    this.dbId = this.generateUUID();
  }

  generateUUID() { // Public Domain/MIT
    var d = new Date().getTime();//Timestamp
    var d2 = ((typeof performance !== 'undefined') && performance.now && (performance.now() * 1000)) || 0;//Time in microseconds since page-load or 0 if unsupported
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      var r = Math.random() * 16;//random number between 0 and 16
      if (d > 0) {//Use timestamp until depleted
        r = (d + r) % 16 | 0;
        d = Math.floor(d / 16);
      } else {//Use microseconds since page-load if supported
        r = (d2 + r) % 16 | 0;
        d2 = Math.floor(d2 / 16);
      }
      return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
  }

  getDocs() {
    // this.docs$ = this.databseService.getAll(`doc-images-${this.dbId}`, this.dbId);
    // this.databseService.getAll(`doc-images-${this.dbId}`, this.dbId).subscribe(res => console.log(res));
    this.idbService.getAllData(`doc-images-${this.dbId}`).subscribe(r => console.log(r));
  }

  addBulkDocs(pages) {
    // this.databseService.insert(`doc-images-${this.dbId}`, this.dbId, pages).subscribe(res => console.log(res));
    console.time('addDocs');
    this.idbService.addItems(`doc-images-${this.dbId}`, pages).subscribe(res => {console.timeEnd('addDocs');console.log(res)});
  }

  addDoc(pages) {
    // this.databseService.insert(`doc-images-${this.dbId}`, this.dbId, pages).subscribe(res => console.log(res));
    console.time('addDocs');
    this.idbService.addItem(`doc-images-${this.dbId}`, pages[0]).subscribe(res => {console.timeEnd('addDocs');console.log(res)});
  }

  addProject() {
    this.idbService.getItem('project', this.projectName).subscribe(r => {
      let dataSets: DataSet[] = (r && r['dataSets']) ? r['dataSets'] : [];
      this.idbService.addItem('project', {id: this.projectName, dataSets}).subscribe(console.log);
    });
  }

  destroyDatabase() {
    this.idbService.deleteDb(`doc-images-${this.dbId}`);
  }

  usage() {
    navigator.storage.estimate().then(r => {
      const usage = Math.round(((r.usage/1048576)*100))/100;
      const quota = Math.round(((r.quota/1048576)*100))/100;
      console.log('quata',quota + "mb");
      console.log('usage',usage + "mb");
    })
  }

  increamentCounter() {
    this.counter++;
  }

  clearCounter(){
    this.counter = 0;
  }
}
