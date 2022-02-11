import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { IndexedDbTestRoutingModule } from './indexed-db-test-routing.module';
import { IndexedDbTestComponent } from './indexed-db-test.component';
import { FormsModule } from '@angular/forms';
// import { DBConfig, NgxIndexedDBModule } from 'ngx-indexed-db';
// import { DatabaseService, DatabaseBackend, getIDBFactory } from './services/database.service';
import { DatabaseTestComponent } from './components/database-test/database-test.component';

// const dbConfig: DBConfig  = {
//   name: 'MyDb',
//   version: 1,
//   objectStoresMeta: [{
//     store: 'people',
//     storeConfig: { keyPath: 'id', autoIncrement: true },
//     storeSchema: [
//       { name: 'name', keypath: 'name', options: { unique: false } },
//       { name: 'email', keypath: 'email', options: { unique: false } }
//     ]
//   }]
// };

@NgModule({
  declarations: [
    IndexedDbTestComponent,
    DatabaseTestComponent
  ],
  imports: [
    CommonModule,
    IndexedDbTestRoutingModule,
    FormsModule,
    // NgxIndexedDBModule.forRoot(dbConfig),
  ],
  // providers: [DatabaseService, { provide: DatabaseBackend, useFactory: getIDBFactory }]
})
export class IndexedDbTestModule { }
