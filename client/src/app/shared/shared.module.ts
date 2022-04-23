import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from "@angular/common/http";
import { MaterialsModule } from './materials.module';
import { NotFoundComponent } from './not-found.component';
import { RegionsTableComponent } from './tables/regions-table/regions-table.component';
import { CountriesTableComponent } from './tables/countries-table/countries-table.component';

const components = [
  RegionsTableComponent,
  CountriesTableComponent
];
const modules = [
  CommonModule,
  ReactiveFormsModule,
  FormsModule,
  HttpClientModule,
  MaterialsModule
];
@NgModule({
  declarations: [
    NotFoundComponent,
    components
  ],
  imports: [
    modules
  ],
  exports: [
    modules,
    components,
  ]
})
export class SharedModule { }
