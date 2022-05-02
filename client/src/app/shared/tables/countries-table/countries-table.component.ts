import { Component, EventEmitter, Output } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { Sort } from '@angular/material/sort';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { mergeMap, Observable, of, Subject, takeUntil } from 'rxjs';
import { defaultCountryQuery } from 'src/app/models/countries/country-query.model';
import { CountryModel } from 'src/app/models/countries/country.model';
import { clearRegionFilter, openForm, readAll, setRegionFilter, textFilterChanged, updatePagination, updateSort } from 'src/app/stores/countries/countries.action';
import { selectAllCountries, selectPageIndex, selectPageSize, selectFilteredCountriesLength as selectFilteredCountriesLength, selectCountriesPage } from 'src/app/stores/countries/countries.selectors';


@Component({
  selector: 'app-countries-table',
  templateUrl: './countries-table.component.html',
  styleUrls: ['./countries-table.component.css']
})
export class CountriesTableComponent {
  @Output()
  editCountry = new EventEmitter<CountryModel>();
  length$: Observable<number>;
  pageIndex$: Observable<number>;
  pageSize$: Observable<number>;
  countries$: Observable<CountryModel[]>;
  destroy$ = new Subject<void>();
  all$: Observable<CountryModel[]>;
  textFilter: string = "";
  displayedColumns: string[] = ["countryId", "countryName", "regionId", "actions"];
  constructor(private _router: Router, private _store: Store, private _route: ActivatedRoute) {
    this.pageIndex$ = this._store.select(selectPageIndex);
    this.pageSize$ = this._store.select(selectPageSize);
    this._store.dispatch(readAll({ ...defaultCountryQuery }));
    this._route.paramMap
      .pipe(
        takeUntil(this.destroy$),
        mergeMap(params => {
          const regionId = +(params.get('regionId') || '0');
          if (regionId) {
            this._store.dispatch(setRegionFilter({ regionId }));
          } else {
            this._store.dispatch(clearRegionFilter());
          }
          return of();
        }))
      .subscribe();
    this.length$ = this._store.select(selectFilteredCountriesLength);
    this.countries$ = this._store.select(selectCountriesPage);
    this.all$ = this._store.select(selectAllCountries);
  }


  ngOnDestory(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
  public edit(country: CountryModel) {
    this._store.dispatch(openForm({ country }));
  }

  public detail(countryId: number): void {
    this._router.navigate(["/countries", countryId]);
  }

  public onPageEvent(pageEvent: PageEvent) {
    this._store.dispatch(updatePagination({ pageIndex: pageEvent.pageIndex, pageSize: pageEvent.pageSize }));
  }

  public sortChange(sortState: Sort) {
    this._store.dispatch(updateSort({ active: sortState.active, asc: sortState.direction === "asc" }));
  }

  public textFilterChange(): void {
    this._store.dispatch(textFilterChanged({ textFilter: this.textFilter }));
  }
}
