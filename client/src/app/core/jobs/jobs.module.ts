import { NgModule } from '@angular/core';
import { JobsRoutingModule } from './jobs-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';


@NgModule({
  declarations: [],
  imports: [
    SharedModule,
    JobsRoutingModule
  ]
})
export class JobsModule { }
