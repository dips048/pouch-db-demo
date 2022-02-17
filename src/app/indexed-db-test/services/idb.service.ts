import { Injectable } from "@angular/core";
import { openDB, IDBPDatabase, deleteDB, DBSchema } from "idb";
import { defer, from, Observable, of } from "rxjs";
import { map, switchMap } from "rxjs/operators";


@Injectable({
  providedIn: "root"
})
export class IdbService {

  openDb(dbName: string, storeName = 'store', keyPath = 'id', version = 1): Observable<IDBPDatabase<any>> {
    return defer(() => from(openDB(dbName, version, {
      upgrade(db) {
        console.log("IndexedDB upgrade");
        db.createObjectStore(storeName, { keyPath });
      },
      blocked() {
        console.log('blocked');
      }
    }
    )));
  }

  getItem(dbName: string, value: string | number, storeName: string = 'store'): Observable<any> {
    return this.openDb(dbName, storeName).pipe(
      switchMap(db => {
        const tx = db.transaction(storeName, "readwrite");
        const store = tx.objectStore(storeName);
        return from(store.get(value));
      })
    );
  }

  addItem<T>(dbName: string, value: T, storeName: string = 'store'): Observable<T> {
    return this.openDb(dbName, storeName).pipe(
      map(db => {
        const tx = db.transaction(storeName, "readwrite");
        tx.objectStore(storeName)
          .put({ ...value })
          .then(v => {
            console.log("add", v);
          })
          .catch(err => {
            console.log(err);
          });
        return value;
      })
    );
  }

  addItems(dbName: string, value: any[], storeName: string = 'store'): Observable<any> {
    return this.openDb(dbName, storeName).pipe(
      map(db => {
        const tx = db.transaction(storeName, "readwrite");
        value.map(v => tx.objectStore(storeName).put({ ...v }));
        return value;
      })
    );
  }

  deleteItem(dbName: string, value: string | number, storeName: string = 'store'): Observable<string | number> {
    return this.openDb(dbName, storeName).pipe(
      map(db => {
        const tx = db.transaction(storeName, "readwrite");
        const store = tx.objectStore(storeName);
        store.delete(value);
        return value;
      })
    );
  }

  deleteItems(dbName: string, value: (string | number)[], storeName: string = 'store'): Observable<(string | number)[]> {
    return this.openDb(dbName,storeName).pipe(
      map(db => {
        const tx = db.transaction(storeName, "readwrite");
        const store = tx.objectStore(storeName);
        value.map(v => store.delete(v));
        return value;
      })
    );
  }

  getAllData<T>(dbName: string, storeName: string = 'store'): Observable<T[]> {
    return this.openDb(dbName, storeName).pipe(
      switchMap(db => {
        const tx = db.transaction(storeName, "readonly");
        const store = tx.objectStore(storeName);
        return from(store.getAll());
      })
    );
  }

  deleteDb(dbName) {
    deleteDB(dbName, {
      blocked() {
        console.log("deleteDB blocked");
      }
    });
  }

  checkOfflineReady<T>(dbName: string): Observable<T[]> {
    return this.openDb(dbName).pipe(
      switchMap(db => {
        const tx = db.transaction("Status", "readonly");
        const store = tx.objectStore("Status");
        return from(store.getAll("concrete-record-sheets"));
      })
    );
  }

  createDb(dbName: string, storeName: string = 'store', keyPath = 'id', version = 1): Promise<IDBPDatabase<any>> {
    return openDB(dbName, version, {
      upgrade(db) {
        console.log("IndexedDB upgrade");
        db.createObjectStore(storeName, { keyPath });
      },
      blocked() {
        console.log('blocked');
      }
    });
  }

  async getDocument(dbName: string, value: string | number, storeName: string = 'store'): Promise<any> {
    const db = await this.createDb(dbName);
    const tx = db.transaction(storeName, "readwrite");
    const store = tx.objectStore('store');
    return await store.get(value);
  }

  async addDocument(dbName: string, value: any, storeName: string = 'store'): Promise<any> {
    const db = await this.createDb(dbName);
    const tx = db.transaction(storeName, "readwrite");
    return await tx.objectStore(storeName).put({ ...value });
  }

  async addDocuments<T>(dbName: string, value: T[], storeName: string = 'store'): Promise<any[]> {
    const db = await this.createDb(dbName, storeName);
    const tx = db.transaction(storeName, "readwrite");
    return value.map(v => tx.objectStore(storeName).put({ ...v }));
  }

  async deleteDocument(dbName: string, value: string | number, storeName: string = 'store'): Promise<void> {
    const db = await this.createDb(dbName, storeName);
    const tx = db.transaction(storeName, "readwrite");
    const store = tx.objectStore(storeName);
    return await store.delete(value);
  }

  async deleteDocuments(dbName: string, value: (string | number)[], storeName: string = 'store'): Promise<any[]> {
    const db = await this.createDb(dbName, storeName);
    const tx = db.transaction(storeName, "readwrite");
    const store = tx.objectStore(storeName);
    return value.map(v => store.delete(v));
  }

  async getAllDocuments(dbName: string, storeName: string = 'store'): Promise<any> {
    const db = await this.createDb(dbName, storeName);
    const tx = db.transaction(storeName, "readonly");
    const store = tx.objectStore(storeName);
    return await store.getAll();
  }

  deleteDatabase(dbName): Promise<any> {
    return deleteDB(dbName, {
      blocked() {
        console.log("deleteDB blocked");
      }
    });
  }

  async checkOfflineReadyy(dbName: string): Promise<any> {
    const db = await this.createDb(dbName);
    const tx = db.transaction("Status", "readonly");
    const store = tx.objectStore("Status");
    return await store.getAll("concrete-record-sheets");
  }
}
