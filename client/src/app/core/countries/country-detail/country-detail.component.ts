import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable, Subject, Subscription, takeUntil } from 'rxjs';
import { CountryDetailModel } from 'src/app/models/countries/country-detail.model';
import { readOne } from '../store/countries.action';
import { selectCountryDetail, selectLoading } from '../store/countries.selectors';

@Component({
  selector: 'app-country-detail',
  templateUrl: './country-detail.component.html',
  styleUrls: ['./country-detail.component.css']
})
export class CountryDetailComponent implements OnInit, OnDestroy {
  country: CountryDetailModel | null = null;
  destroy$ = new Subject<void>();
  country$: Observable<CountryDetailModel | null>;
  loading$: Observable<boolean>;
  constructor(
    private _route: ActivatedRoute,
    private _store: Store
  ) {
    this._store.select(selectCountryDetail).pipe(
      takeUntil(this.destroy$)).subscribe((country) => {
        this.country = country;
      })
    this.country$ = this._store.select(selectCountryDetail);
    this.loading$ = this._store.select(selectLoading);
  }


  ngOnInit(): void {
    this._route.paramMap
      .pipe(takeUntil(this.destroy$))
      .subscribe(this.subscribeFn);

  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.unsubscribe();
  }

  private subscribeFn = (param: ParamMap) => {
    const countryId = +(param.get('countryId') || '0');
    if (countryId !== 0) {
      this._store.dispatch(readOne({ countryId }));
    }
  }
}
