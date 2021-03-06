import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { CountryUpdateModel } from 'src/app/models/countries/country-update.model';
import { CountryModel } from 'src/app/models/countries/country.model';
import { RegionModel } from 'src/app/models/regions/region.model';
import { createOne as createCountryAction } from 'src/app/core/store/countries/countries.action';
import { updateOne as updateCountryAction } from 'src/app/core/store/countries/countries.action';
import { selectAllRegions } from 'src/app/core/store/region/regions.selectors';


@Component({
  selector: 'app-country-upsert-dialog',
  templateUrl: './country-upsert-dialog.component.html',
  styleUrls: ['./country-upsert-dialog.component.css']
})
export class CountryUpsertDialogComponent  {
  public country: CountryUpdateModel;
  public countryForm: FormGroup;
  public regions$ : Observable<RegionModel[]>;
  constructor(
    private _store: Store,
    private _fb: FormBuilder,
    private dialogRef: MatDialogRef<CountryUpsertDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: CountryModel
  ) {
    this.country = data;
    this.countryForm = this._fb.group({
      countryName: [this.country?.countryName, [Validators.required, Validators.maxLength(52)]],
      regionId: [this.country?.regionId || 0, [Validators.required, Validators.min(1)]]
    });
    this.regions$ = this._store.select(selectAllRegions);
  }

  public submitForm() {
    const model = this.formToModel();
    if (model.countryId) {
      this._store.dispatch(updateCountryAction({ country: model }));
    } else {
      this._store.dispatch(createCountryAction({ country: model }));
    }
  }

  private formToModel(): CountryUpdateModel {
    const model = {
      countryId: this.country?.countryId || 0,
      countryName: this.countryForm.value.countryName,
      regionId: this.countryForm.value.regionId
    }
    return model
  }

  public close(){
    this.dialogRef.close();
  }
}
