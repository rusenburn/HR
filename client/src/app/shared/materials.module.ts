import { NgModule } from '@angular/core';
import { MatSidenavModule } from "@angular/material/sidenav";
import { MatToolbarModule } from "@angular/material/toolbar";
import { MatButtonModule } from "@angular/material/button";
import { MatListModule } from "@angular/material/list"
import { MatIconModule } from "@angular/material/icon";
import { MatDialogModule } from "@angular/material/dialog";
import { MatCardModule } from "@angular/material/card";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {MatTableModule} from "@angular/material/table";
import {MatSelectModule} from "@angular/material/select";

const material = [
  MatSidenavModule,
  MatToolbarModule,
  MatButtonModule,
  MatListModule,
  MatIconModule,
  MatDialogModule,
  MatCardModule,
  MatFormFieldModule,
  MatInputModule,
  MatTableModule,
  MatSelectModule
]

@NgModule({
  declarations: [],
  exports: [
    material
  ]
})
export class MaterialsModule { }
