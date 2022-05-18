import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EmployeeDetailComponent } from './employee-detail/employee-detail.component';
import { IndexComponent } from './index/index.component';

const routes: Routes = [
  { path: "index", component: IndexComponent },
  { path: ":employeeId", component: EmployeeDetailComponent },
  { path: "", redirectTo: "index", pathMatch: "full" }
]

@NgModule({
  declarations: [],
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EmployeesRoutingModule { }
