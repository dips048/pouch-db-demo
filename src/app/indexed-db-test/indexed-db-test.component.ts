import { Component, OnInit } from '@angular/core';
import { NgxIndexedDBService } from 'ngx-indexed-db';
import { GetHttpService } from '../services';
import { Page } from '../shared/models';
import { IdbKeyvalService } from './services/idb-keyval.service';

@Component({
  selector: 'app-indexed-db-test',
  templateUrl: './indexed-db-test.component.html',
  styleUrls: ['./indexed-db-test.component.scss']
})
export class IndexedDbTestComponent implements OnInit {
  dbId = 'dbName1';
  pages: Page[];
  values: IDBRequest<any[]> | undefined[] = [];

  constructor(
    private IdbKeyvalService: IdbKeyvalService,
    private getHttpService: GetHttpService,
    // private dbService: NgxIndexedDBService,
  ) { }

  ngOnInit(): void {
    this.getHttpService.getPagesData().subscribe(response =>this.pages = response.body.map(r => ({...r, id: r._id})));
      // this.dbService.add('people', { name: `Bruce Wayne`, email: `bruce@wayne.com`,}).subscribe(key => console.log('key: ', key));
    // this.IdbKeyvalService.setValue()
    //   .then(r => console.log(r))
    //   .catch(e => console.warn(e));

    // this.IdbKeyvalService.getValue()
    //   .then(r => console.log(r))
    //   .catch(e => console.warn(e));
  }

  getAllData() {
    this.IdbKeyvalService.getAllData('whiskeyStore').then(r => {
      r.onsuccess = (() => console.log('values',r.result));
    });
  }

  addPages() {
    this.IdbKeyvalService.addData(`doc-images-${this.dbId}`, this.pages[0]);
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

  getAll(objectStore: string): any {
    let tx: IDBTransaction;
    let dbRequest = window.indexedDB.open(`${objectStore}`,1);
    dbRequest.onsuccess = (event => {
      let db: IDBDatabase = event.target['result'];
      console.log('success', db);
      tx = db.transaction(objectStore, 'readwrite');
      tx.oncomplete = () => console.log('Transaction Complete');
      let store: IDBObjectStore = tx.objectStore(objectStore);
      store.getAll().onsuccess = (ev => {console.log(ev); this.values = ev.target['result'];});
    })
    dbRequest.onupgradeneeded = (event => {
      let db = event.target['result'];
      console.log('upgrade', db);
      if (!db.objectStoreNames.contains(objectStore)) {
        db.createObjectStore(objectStore, { keyPath: 'id' });
      }
    });
    dbRequest.onerror = (err => console.error(err));
  }

}
