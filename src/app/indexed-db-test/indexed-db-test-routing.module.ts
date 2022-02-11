import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DatabaseTestComponent } from './components/database-test/database-test.component';
import { IndexedDbTestComponent } from './indexed-db-test.component';

const routes: Routes = [
  { path: '', component: IndexedDbTestComponent },
  { path: 'database-test', component: DatabaseTestComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class IndexedDbTestRoutingModule { }
