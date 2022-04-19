import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { DepartmentsRoutingModule } from './departments-routing.module';
import { IndexComponent } from './index/index.component';
import { DepartmentsUpsertDialogComponent } from './departments-upsert-dialog/departments-upsert-dialog.component';
import { StoreModule } from '@ngrx/store';
import { reducers, metaReducers } from './store/departments.state';
import { EffectsModule } from '@ngrx/effects';
import { DepartmentsEffects } from "./store/departments.effects";

@NgModule({
  declarations: [
    IndexComponent,
    DepartmentsUpsertDialogComponent
  ],
  imports: [
    SharedModule,
    DepartmentsRoutingModule,
    StoreModule.forFeature("[DEPARTMENTS]", reducers, { metaReducers }),
    EffectsModule.forFeature([DepartmentsEffects])
  ]
})
export class DepartmentsModule { }
