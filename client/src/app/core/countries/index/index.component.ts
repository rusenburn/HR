import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { map, mergeMap, Observable, of, Subject, switchMap, takeUntil } from 'rxjs';
import { CountryModel } from 'src/app/models/countries/country.model';
import * as CountriesSelectors from "src/app/stores/countries/countries.selectors";
import * as CountriesActions from "src/app/stores/countries/countries.action";
import { CountryUpdateModel } from 'src/app/models/countries/country-update.model';
import { CountryUpsertDialogComponent } from '../country-upsert-dialog/country-upsert-dialog.component';
import { RegionModel } from 'src/app/models/regions/region.model';
import { readAll as readAllRegions } from "src/app/stores/region/regions.actions";
import { selectAllRegions } from 'src/app/stores/region/regions.selectors';
import { ActivatedRoute } from '@angular/router';
import { defaultRegionQuery } from 'src/app/models/regions/region-query.model';
import { defaultCountryQuery } from 'src/app/models/countries/country-query.model';
@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.css']
})
export class IndexComponent implements OnInit, OnDestroy {
  countries$: Observable<CountryModel[]>;
  loading$: Observable<boolean>;
  displayedColumns: string[] = ["countryId", "countryName", "regionId", "actions"];
  regions$: Observable<RegionModel[]>;
  regions: RegionModel[] = [];
  destroy$ = new Subject<void>();

  constructor(
    private _store: Store,
    private _dialog: MatDialog,
  ) {
    this.countries$ = this._store.select(CountriesSelectors.selectAllCountries);
    this.loading$ = this._store.select(CountriesSelectors.selectLoading);
    this.regions$ = this._store.select(selectAllRegions);
    this.regions$
      .pipe(takeUntil(this.destroy$))
      .subscribe((data) => this.regions = data);
  }
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
  ngOnInit(): void {
    this._store.dispatch(CountriesActions.readAll(defaultCountryQuery));

    this._store.dispatch(readAllRegions(defaultRegionQuery));
  }

  openDialog(country: CountryUpdateModel | null): void {
    const di = this._dialog.open(CountryUpsertDialogComponent, {
      width: '600px',
      data: {
        country: country,
        regions: this.regions
      }
    })
  }


}
