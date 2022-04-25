import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { IndexComponent } from './index/index.component';
import { JobDetailComponent } from './job-detail/job-detail.component';

const routes: Routes = [
  { path: "index", component: IndexComponent },
  { path: ":jobId", component: JobDetailComponent },
  { path: "", redirectTo: "index", pathMatch: "full" }
]


@NgModule({
  declarations: [],
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class JobsRoutingModule { }
