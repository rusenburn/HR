import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { JobHistoryRoutingModule } from './job-history-routing.module';
import { IndexComponent } from './index/index.component';



@NgModule({
  declarations: [
    IndexComponent,
  ],
  imports: [
    SharedModule,
    JobHistoryRoutingModule,
  ]
})
export class JobHistoryModule { }
