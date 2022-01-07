import { Injectable } from '@angular/core';
import PouchDB from 'pouchdb-browser';
import WorkerPouch from 'worker-pouch';

// (<any>PouchDB).adapter('worker', require('worker-pouch'));
// declare var require: any;

(<any>PouchDB).adapter('worker', WorkerPouch)

@Injectable({
  providedIn: 'root'
})
export class PouchDbWorkerService {

  constructor() { }
}
