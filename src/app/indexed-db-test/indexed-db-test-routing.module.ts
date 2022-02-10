import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { IndexedDbTestComponent } from './indexed-db-test.component';

const routes: Routes = [{ path: '', component: IndexedDbTestComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class IndexedDbTestRoutingModule { }
