import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';

const modules = [
  SharedModule
]

@NgModule({
  declarations: [
  ],
  imports: [
    modules,
  ],
  exports: [
    // TODO mb we need to remove this
    modules
  ]
})
export class CoreModule { }
