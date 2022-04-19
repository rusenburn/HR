import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { EmployeesRoutingModule } from './employees-routing.module';



@NgModule({
  declarations: [],
  imports: [
    SharedModule,
    EmployeesRoutingModule
  ]
})
export class EmployeesModule { }
