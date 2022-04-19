import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from "@angular/common/http";
import { MaterialsModule } from './materials.module';
import { NotFoundComponent } from './not-found.component';


@NgModule({
  declarations: [
    NotFoundComponent
  ],
  imports:[
  ],
  exports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    MaterialsModule
  ]
})
export class SharedModule { }
