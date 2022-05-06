import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { HomeComponent } from './home/home.component';

const modules = [
  SharedModule
]

@NgModule({
  declarations: [
    HomeComponent
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
