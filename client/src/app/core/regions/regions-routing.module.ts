import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { IndexComponent } from './index/index.component';
import { RegionDetailComponent } from './region-detail/region-detail.component';

const routes:Routes=[
  {path:"index",component:IndexComponent},
  {path:":regionId",component:RegionDetailComponent},
  {path:"",redirectTo:"index",pathMatch:"full"},
]

@NgModule({
  declarations: [],
  imports: [RouterModule.forChild(routes)],
  exports:[RouterModule]
})
export class RegionsRoutingModule { }
