import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { DepartmentsRoutingModule } from './departments-routing.module';
import { IndexComponent } from './index/index.component';
import { DepartmentDetailComponent } from './department-detail/department-detail.component';

@NgModule({
  declarations: [
    IndexComponent,
    DepartmentDetailComponent
  ],
  imports: [
    SharedModule,
    DepartmentsRoutingModule,
  ]
})
export class DepartmentsModule { }
