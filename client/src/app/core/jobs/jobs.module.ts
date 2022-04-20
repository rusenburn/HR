import { NgModule } from '@angular/core';
import { JobsRoutingModule } from './jobs-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { StoreModule } from '@ngrx/store';
import { reducers as jobsReducers, metaReducers } from './store/jobs.state';
import { EffectsModule } from '@ngrx/effects';
import { JobsEffects as JobsAPIEffects } from './store/jobs.effects';
import { IndexComponent } from './index/index.component';
import { JobsUpsertDialogComponent } from './jobs-upsert-dialog/jobs-upsert-dialog.component';

@NgModule({
  declarations: [
    IndexComponent,
    JobsUpsertDialogComponent
  ],
  imports: [
    SharedModule,
    JobsRoutingModule,
    StoreModule.forFeature("[JOBS]", jobsReducers, { metaReducers }),
    EffectsModule.forFeature([JobsAPIEffects])
  ]
})
export class JobsModule { }
