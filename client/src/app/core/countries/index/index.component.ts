import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { Observable, Subject, takeUntil } from 'rxjs';
import { CountryModel } from 'src/app/models/countries/country.model';
import * as CountriesSelectors from "src/app/stores/countries/countries.selectors";
import { CountryUpdateModel } from 'src/app/models/countries/country-update.model';
import { CountryUpsertDialogComponent } from 'src/app/shared/dialoges/country-upsert-dialog/country-upsert-dialog.component';
import { RegionModel } from 'src/app/models/regions/region.model';
import { readAll as readAllRegions } from "src/app/stores/region/regions.actions";
import { selectAllRegions } from 'src/app/stores/region/regions.selectors';
import { defaultRegionQuery } from 'src/app/models/regions/region-query.model';
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

  ngOnInit(): void {
    this._store.dispatch(readAllRegions({ ...defaultRegionQuery }));
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  openDialog(country: CountryUpdateModel | null): void {
    const di = this._dialog.open(CountryUpsertDialogComponent, {
      width: '600px',
      data: {
        country: country,
        regions: this.regions
      },
      disableClose:true
    })
  }


}
