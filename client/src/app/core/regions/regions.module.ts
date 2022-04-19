import { NgModule } from '@angular/core';
import { MetaReducer, StoreModule } from '@ngrx/store';
import { SharedModule } from '../../shared/shared.module';
import { RegionsRoutingModule } from './regions-routing.module';
import * as RegionsState from "../../core/regions/store/regions.state"
import { IndexComponent } from './index/index.component';
import { EffectsModule } from '@ngrx/effects';
import { RegionsApiEffects } from '../../core/regions/store/regions.effects';
import { RegionUpsertDialogComponent } from '../../core/regions/region-upsert-dialog/region-upsert-dialog.component';


export const metaReducers: MetaReducer<RegionsState.State>[] = RegionsState.metaReducers;

@NgModule({
  declarations: [
    IndexComponent,
    RegionUpsertDialogComponent,
  ],
  imports: [
    SharedModule,
    RegionsRoutingModule,
    StoreModule.forFeature("[REGIONS]", RegionsState.reducers, { metaReducers }),
    EffectsModule.forFeature([RegionsApiEffects])
  ]
})
export class RegionsModule { }