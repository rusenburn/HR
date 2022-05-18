import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DepartmentDetailComponent } from './department-detail/department-detail.component';
import { IndexComponent } from './index/index.component';

const routes: Routes = [
  { path: "index", component: IndexComponent },
  { path: ":departmentId", component: DepartmentDetailComponent },
  { path: "", redirectTo: "index", pathMatch: "full" },
]

@NgModule({
  declarations: [],
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DepartmentsRoutingModule { }
