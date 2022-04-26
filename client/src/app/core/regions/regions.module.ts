import { NgModule } from '@angular/core';
import { MetaReducer, StoreModule } from '@ngrx/store';
import { SharedModule } from '../../shared/shared.module';
import { RegionsRoutingModule } from './regions-routing.module';
import * as RegionsState from "../../stores/region/regions.state"
import { IndexComponent } from './index/index.component';
import { EffectsModule } from '@ngrx/effects';
import { RegionsApiEffects } from '../../stores/region/regions.effects';
import { RegionUpsertDialogComponent } from '../../core/regions/region-upsert-dialog/region-upsert-dialog.component';
import { RegionDetailComponent } from './region-detail/region-detail.component';


export const metaReducers: MetaReducer<RegionsState.State>[] = RegionsState.metaReducers;

@NgModule({
  declarations: [
    IndexComponent,
    RegionUpsertDialogComponent,
    RegionDetailComponent,
  ],
  imports: [
    SharedModule,
    RegionsRoutingModule,
    // StoreModule.forFeature("[REGIONS]", RegionsState.reducers, { metaReducers }),
    // EffectsModule.forFeature([RegionsApiEffects])
  ]
})
export class RegionsModule { }