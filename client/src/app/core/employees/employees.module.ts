import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { SharedModule } from 'src/app/shared/shared.module';
import { EmployeesRoutingModule } from './employees-routing.module';
import { EmployeesAPIEffects } from './store/employees.effect';
import { reducers as employeesReducers, metaReducers } from "./store/employees.state";
import { IndexComponent } from './index/index.component';
import { EmployeeUpsertDialogComponent } from './employee-upsert-dialog/employee-upsert-dialog.component';
import { EmployeeDetailComponent } from './employee-detail/employee-detail.component';


@NgModule({
  declarations: [
    IndexComponent,
    EmployeeUpsertDialogComponent,
    EmployeeDetailComponent
  ],
  imports: [
    SharedModule,
    EmployeesRoutingModule,
    StoreModule.forFeature("[EMPLOYEES]", employeesReducers, { metaReducers }),
    EffectsModule.forFeature([EmployeesAPIEffects])
  ]
})
export class EmployeesModule { }
