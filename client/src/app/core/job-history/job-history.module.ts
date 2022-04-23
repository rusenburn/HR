import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { SharedModule } from 'src/app/shared/shared.module';
import { JobHistoryRoutingModule } from './job-history-routing.module';
import { JobHistoryAPIEffects } from './store/job-history.effects';
import { metaReducers, reducers as jobHistoryReducers } from './store/job-history.state';
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
    StoreModule.forFeature("[JOBHISTORY]", jobHistoryReducers, { metaReducers }),
    EffectsModule.forFeature([JobHistoryAPIEffects])
  ]
})
export class JobHistoryModule { }
