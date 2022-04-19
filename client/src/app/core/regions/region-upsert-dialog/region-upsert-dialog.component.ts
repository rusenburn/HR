import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { RegionUpdateModel } from 'src/app/models/regions/region-update.model';
import * as RegionActions from '../store/regions.actions';


@Component({
  selector: 'app-region-upsert-dialog',
  templateUrl: './region-upsert-dialog.component.html',
  styleUrls: ['./region-upsert-dialog.component.css']
})
export class RegionUpsertDialogComponent implements OnInit {
  public region: RegionUpdateModel;
  public regionForm:FormGroup;
  constructor(
    private _store:Store,
    private _fb:FormBuilder,
    public dialogRef: MatDialogRef<RegionUpsertDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: RegionUpdateModel,
  ) {
    this.region = data;
    this.regionForm = this._fb.group({
      regionName: [this.region?.regionName, [Validators.required, Validators.maxLength(52)]]
    })
  }
  ngOnInit(): void {
  }


  public submitForm() {
    let model = this.formToModel();
    if (model.regionId) {
      this._store.dispatch(RegionActions.updateOne({ region: { ...model } }));
    } else {
      this._store.dispatch(RegionActions.createOne({ region: { ...model } }));
    }
  }

  private formToModel(): RegionUpdateModel {
    let model = {
      regionId: this.region?.regionId || 0,
      regionName: this.regionForm.value.regionName
    };
    return model;
  }
  public close()
  {
    this.dialogRef.close();
  }
}
