import { NgModule } from '@angular/core';
import { JobsRoutingModule } from './jobs-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { IndexComponent } from './index/index.component';
import { JobsUpsertDialogComponent } from './jobs-upsert-dialog/jobs-upsert-dialog.component';
import { JobDetailComponent } from './job-detail/job-detail.component';

@NgModule({
  declarations: [
    IndexComponent,
    JobsUpsertDialogComponent,
    JobDetailComponent
  ],
  imports: [
    SharedModule,
    JobsRoutingModule,
  ]
})
export class JobsModule { }
