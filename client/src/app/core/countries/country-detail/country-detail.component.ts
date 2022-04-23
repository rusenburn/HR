import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
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
  subs: Subscription[] = [];
  country$: Observable<CountryDetailModel | null>;
  loading$: Observable<boolean>;
  constructor(
    private _route: ActivatedRoute,
    private _store: Store
  ) {
    let sub = this._store.select(selectCountryDetail).subscribe((country) => {
      this.country = country;
    })
    this.subs.push(sub);
    this.country$ = this._store.select(selectCountryDetail);
    this.loading$ = this._store.select(selectLoading);
  }


  ngOnInit(): void {
    let a = this._route.paramMap.subscribe(this.subscribeFn);
    this.subs.push(a)
  }

  ngOnDestroy(): void {
    for (let sub of this.subs) {
      if (!sub.closed) {
        sub.unsubscribe();
      }
    }
  }

  private subscribeFn = (param: ParamMap) => {
    const countryId = +(param.get('countryId') || '0');
    if (countryId !== 0) {
      this._store.dispatch(readOne({ countryId }));
    }
  }
}
