import { Inject, Injectable } from "@angular/core";
import { from, mergeMap, Observable, Observer, Subject, tap } from "rxjs";
import { DBSchema, DBStore, DBUpgradeHandler } from "src/app/shared/models";

export const IDB_SUCCESS = 'success';
export const IDB_COMPLETE = 'complete';
export const IDB_ERROR = 'error';
export const IDB_UPGRADE_NEEDED = 'upgradeneeded';

export const IDB_TXN_READ = 'readonly';
export const IDB_TXN_READWRITE = 'readwrite';

export const DB_INSERT = 'DB_INSERT';

export function getIDBFactory(): IDBFactory {
  return typeof window !== 'undefined' ? window.indexedDB : self.indexedDB;
}

@Injectable({
  providedIn: 'root',
})
export class DatabaseService {
  public changes: Subject<any> = new Subject();

  private _idb: IDBFactory;
  private _schema: DBSchema = { name: 'default', version: 1, stores: {['default']: {primaryKey: 'id'} } };

  constructor() {
    // this._schema = { version: 1, name: 'MyDB',  stores: { ['footer']: { primaryKey: 'footerCache' } } }
    this._idb = getIDBFactory();
  }

  openDb(dbName: string, storeName: string, version: number = 1, upgradeHandler?: DBUpgradeHandler): Observable<IDBDatabase> {
    const idb = this._idb;
    return new Observable((observer: Observer<any>) => {
      // const openReq = idb.open(dbName, this._schema.version);
      const openReq = idb.open(dbName, version);

      const onSuccess = (event: any) => {
        this._schema = {name: dbName, version, stores: {[storeName]: {primaryKey: 'id'}}};
        observer.next(event.target.result);
        observer.complete();
      };
      const onError = (err: any) => {
        console.log(err);
        observer.error(err);
      };

      const onUpgradeNeeded = (event: any) => {
        this._schema = {name: dbName, version, stores: {[storeName]: {primaryKey: 'id'}}};
        this._upgradeDB(observer, event.target.result, storeName);
      };

      openReq.addEventListener(IDB_SUCCESS, onSuccess);
      openReq.addEventListener(IDB_ERROR, onError);
      openReq.addEventListener(IDB_UPGRADE_NEEDED, onUpgradeNeeded);

      return () => {
        openReq.removeEventListener(IDB_SUCCESS, onSuccess);
        openReq.removeEventListener(IDB_ERROR, onError);
        openReq.removeEventListener(IDB_UPGRADE_NEEDED, onUpgradeNeeded);
      };
    });
  }

  deleteDatabase(dbName: string): Observable<any> {
    return new Observable((deletionObserver: Observer<any>) => {
      const deleteRequest = this._idb.deleteDatabase(dbName);

      const onSuccess = (event: any) => {
        deletionObserver.next(null);
        deletionObserver.complete();
      };
      const onError = (err: any) => deletionObserver.error(err);

      deleteRequest.addEventListener(IDB_SUCCESS, onSuccess);
      deleteRequest.addEventListener(IDB_ERROR, onError);

      return () => {
        deleteRequest.removeEventListener(IDB_SUCCESS, onSuccess);
        deleteRequest.removeEventListener(IDB_ERROR, onError);
      };
    });
  }

  addSingleDoc() {

  }

  insert(dbName, storeName: string, records: any[], notify: boolean = true): Observable<any> {
    return this.executeWrite(dbName, storeName, 'put', records).pipe(
      tap(payload =>  notify ? this.changes.next({ type: DB_INSERT, payload: payload }) : {})
    );
  }

  executeWrite(dbName: string, storeName: string, actionType: string, records: any[]): Observable<any> {
    return this.openDb(dbName, storeName).pipe(
      mergeMap((db: IDBDatabase) => {
        return new Observable((txnObserver: Observer<any>) => {
          const recordSchema = this._schema.stores[storeName];
          console.log(recordSchema);
          const mapper = this._mapRecord(recordSchema);
          console.log(this._schema);
          const txn = db.transaction(storeName, IDB_TXN_READWRITE);
          const objectStore: any = txn.objectStore(storeName);

          const onTxnError = (err: any) => txnObserver.error(err);
          const onTxnComplete = () => txnObserver.complete();

          txn.addEventListener(IDB_COMPLETE, onTxnComplete);
          txn.addEventListener(IDB_ERROR, onTxnError);

          const makeRequest = (record: any) => {
            return new Observable((reqObserver: Observer<any>) => {
              let req: any;
              if (recordSchema.primaryKey) {
                req = objectStore[actionType](record);
              } else {
                let $key = record['$key'];
                let $record = (Object as any).assign({}, record);
                delete $record.key;
                req = objectStore[actionType]($record, $key);
              }
              req.addEventListener(IDB_SUCCESS, () => {
                let $key = req.result;
                reqObserver.next(mapper({ $key, record }));
              });
              req.addEventListener(IDB_ERROR, (err: any) => {
                reqObserver.error(err);
              });
            });
          };

          /* let requestSubscriber = mergeMap
                    .call(from(records), makeRequest)
                    .subscribe(txnObserver); */
          var requestSubscriber = from(records)
            .pipe(mergeMap(makeRequest))
            .subscribe(txnObserver);

          return () => {
            requestSubscriber.unsubscribe();
            txn.removeEventListener(IDB_COMPLETE, onTxnComplete);
            txn.removeEventListener(IDB_ERROR, onTxnError);
          };
        });
      })
    );
  }

  get(dbName, storeName: string, key: any): Observable<any> {
    return this.openDb(dbName, storeName).pipe(
      mergeMap((db: IDBDatabase) => {
        return new Observable((txnObserver: Observer<any>) => {
          const txn = db.transaction([storeName], IDB_TXN_READ);
          const objectStore = txn.objectStore(storeName);
          const getRequest = objectStore.get(key);

          const onTxnError = (err: any) => txnObserver.error(err);
          const onTxnComplete = () => txnObserver.complete();
          const onRecordFound = () => txnObserver.next(getRequest.result);

          txn.addEventListener(IDB_COMPLETE, onTxnComplete);
          txn.addEventListener(IDB_ERROR, onTxnError);

          getRequest.addEventListener(IDB_SUCCESS, onRecordFound);
          getRequest.addEventListener(IDB_ERROR, onTxnError);

          return () => {
            getRequest.removeEventListener(IDB_SUCCESS, onRecordFound);
            getRequest.removeEventListener(IDB_ERROR, onTxnError);
            txn.removeEventListener(IDB_COMPLETE, onTxnComplete);
            txn.removeEventListener(IDB_ERROR, onTxnError);
          };
        });
      })
    );
  }

  getAll(dbName, storeName: string): Observable<any> {
    return this.openDb(dbName, storeName).pipe(
      mergeMap((db: IDBDatabase) => {
        return new Observable((txnObserver: Observer<any>) => {
          const txn = db.transaction([storeName], IDB_TXN_READ);
          const objectStore = txn.objectStore(storeName);
          const getRequest = objectStore.getAll();

          const onTxnError = (err: any) => txnObserver.error(err);
          const onTxnComplete = () => txnObserver.complete();
          const onRecordFound = () => txnObserver.next(getRequest.result);

          txn.addEventListener(IDB_COMPLETE, onTxnComplete);
          txn.addEventListener(IDB_ERROR, onTxnError);

          getRequest.addEventListener(IDB_SUCCESS, onRecordFound);
          getRequest.addEventListener(IDB_ERROR, onTxnError);

          return () => {
            getRequest.removeEventListener(IDB_SUCCESS, onRecordFound);
            getRequest.removeEventListener(IDB_ERROR, onTxnError);
            txn.removeEventListener(IDB_COMPLETE, onTxnComplete);
            txn.removeEventListener(IDB_ERROR, onTxnError);
          };
        });
      })
    );
  }

  compare(a: any, b: any): number {
    return this._idb.cmp(a, b);
  }

  private _mapRecord(objectSchema: DBStore) {
    return (dbResponseRec: any) => {
      if (!objectSchema.primaryKey) {
        dbResponseRec.record['$key'] = dbResponseRec['$key'];
      }
      // console.log('_mapRecord', dbResponseRec.record);
      return dbResponseRec.record;
    };
  }

  private _upgradeDB(observer: Observer<IDBDatabase>, db: IDBDatabase, storeName) {
    // for (let storeName in this._schema.stores) {
    //   if (db.objectStoreNames.contains(storeName)) {
    //     db.deleteObjectStore(storeName);
    //   }
    //   this._createObjectStore(db, storeName, this._schema.stores[storeName]);
    // }
    if (!db.objectStoreNames.contains(storeName)) {
      db.createObjectStore(storeName, {autoIncrement: false, keyPath: 'id'});
    }
    observer.next(db);
    observer.complete();
  }

  private _createObjectStore(db: IDBDatabase, key: string, schema: DBStore) {
    db.createObjectStore(key, {
      autoIncrement: true,
      keyPath: schema.primaryKey
    });
  }
}
