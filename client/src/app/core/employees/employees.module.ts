import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { EmployeesRoutingModule } from './employees-routing.module';
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
  ]
})
export class EmployeesModule { }
