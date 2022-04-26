import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { CountryModel } from 'src/app/models/countries/country.model';
import * as CountriesSelectors from "src/app/stores/countries/countries.selectors";
import * as CountriesActions from "src/app/stores/countries/countries.action";
import { CountryUpdateModel } from 'src/app/models/countries/country-update.model';
import { CountryUpsertDialogComponent } from '../country-upsert-dialog/country-upsert-dialog.component';
import { RegionModel } from 'src/app/models/regions/region.model';
import {readAll as readAllRegions} from "src/app/stores/region/regions.actions";
import { selectAllRegions } from 'src/app/stores/region/regions.selectors';
@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.css']
})
export class IndexComponent implements OnInit {
  countries$:Observable<CountryModel[]>;
  loading$:Observable<boolean>;
  displayedColumns: string[] = ["countryId", "countryName", "regionId", "actions"];
  regions$:Observable<RegionModel[]>;
  regions:RegionModel[]=[];
  constructor(
    private _store:Store,
    private _dialog:MatDialog
  ) {
    this.countries$ = this._store.select(CountriesSelectors.selectAllCountries);
    this.loading$ = this._store.select(CountriesSelectors.selectLoading);
    this.regions$ = this._store.select(selectAllRegions);
    this.regions$.subscribe((data)=>this.regions=data);
    
   }
  ngOnInit(): void {
    this._store.dispatch(CountriesActions.readAll());
    this._store.dispatch(readAllRegions());
  }

  openDialog(country:CountryUpdateModel|null):void{
    const di = this._dialog.open(CountryUpsertDialogComponent,{
      width:'600px',
      data:{
        country:country,
        regions:this.regions
      }
    })
  }
}
