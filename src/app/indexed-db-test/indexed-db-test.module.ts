import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { IndexedDbTestRoutingModule } from './indexed-db-test-routing.module';
import { IndexedDbTestComponent } from './indexed-db-test.component';


@NgModule({
  declarations: [
    IndexedDbTestComponent
  ],
  imports: [
    CommonModule,
    IndexedDbTestRoutingModule
  ]
})
export class IndexedDbTestModule { }
