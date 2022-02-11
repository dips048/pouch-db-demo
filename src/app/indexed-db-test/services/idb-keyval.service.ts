import { Injectable } from '@angular/core';
import { get, set, update } from 'idb-keyval';

@Injectable({
  providedIn: 'root'
})
export class IdbKeyvalService {

  db: IDBDatabase = null;

  setValue(id = 'user_id') {
    return set(id, new Date().getTime());
  }

  getValue(id = 'user_id') {
    return get(id);
  }

  updateValue(id = 'user_id', data) {
    return update(id, () => data);
  }

  createDb(dbName: string, objectStore: string): IDBOpenDBRequest {
    let dbOpenReq = indexedDB.open(dbName, 1);
    dbOpenReq.addEventListener('error', (err) => { console.log(err); });
    dbOpenReq.addEventListener('success', (ev) => {
      this.db = ev.target['result'];
      console.log('success', this.db);
    });
    dbOpenReq.addEventListener('upgradeneeded', (ev) => {
      this.db = ev.target['result'];
      let oldVersion = ev.oldVersion;
      let newVersion = ev.newVersion || this.db.version;
      console.log('DB updated from version', oldVersion, 'to', newVersion);
      console.log('upgrade', this.db);
      if (!this.db.objectStoreNames.contains(objectStore)) {
        this.db.createObjectStore(objectStore, {
          keyPath: 'id',
        });
      }
    });
    return dbOpenReq;
  }

  addData(objectStore: string, data: any) {
    let dbRequest = this.createDb(`${objectStore}`, objectStore);
    dbRequest.onsuccess = (event => {
      let db: IDBDatabase = event.target['result'];
      console.log('success', db);
      let tx: IDBTransaction = db.transaction(objectStore, 'readwrite');
      tx.oncomplete = () => console.log('Transaction Complete');
      let store: IDBObjectStore = tx.objectStore(objectStore);
      store.add(data).onsuccess = (ev => console.log('data added', ev));
    })
    dbRequest.onerror = (err => console.error(err));
  }

  getAllData(objectStore: string): any {
    let tx: IDBTransaction;
    let values: IDBRequest<any[]>;
    let dbRequest = this.createDb(`${objectStore}`, objectStore);
    dbRequest.onsuccess = (event => {
      let db: IDBDatabase = event.target['result'];
      console.log('success', this.db);
      tx = db.transaction(objectStore, 'readwrite');
      tx.oncomplete = () => console.log('Transaction Complete');
      let store: IDBObjectStore = tx.objectStore(objectStore);
      store.getAll().onsuccess = (ev => values = ev.target['result']);
    })
    dbRequest.onerror = (err => console.error(err));
  }

}

