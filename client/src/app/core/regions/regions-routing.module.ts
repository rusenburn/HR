import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { IndexComponent } from './index/index.component';

const routes:Routes=[
  {path:"index",component:IndexComponent},
  {path:"",redirectTo:"index",pathMatch:"full"}
]

@NgModule({
  declarations: [],
  imports: [RouterModule.forChild(routes)],
  exports:[RouterModule]
})
export class RegionsRoutingModule { }
