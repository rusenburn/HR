import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { JobHistoryRoutingModule } from './job-history-routing.module';
import { IndexComponent } from './index/index.component';
import { JobHistoryUpsertDialogComponent } from './job-history-upsert-dialog/job-history-upsert-dialog.component';



@NgModule({
  declarations: [
    IndexComponent,
    JobHistoryUpsertDialogComponent
  ],
  imports: [
    SharedModule,
    JobHistoryRoutingModule,
  ]
})
export class JobHistoryModule { }
