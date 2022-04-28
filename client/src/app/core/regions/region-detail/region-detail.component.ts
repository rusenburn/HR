import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable, Subject, takeUntil } from 'rxjs';
import { RegionDetailModel } from 'src/app/models/regions/region-detail.model';
import { readOne } from '../../../stores/region/regions.actions';
import { selectLoading, selectRegionDetail } from '../../../stores/region/regions.selectors';

@Component({
  selector: 'app-region-detail',
  templateUrl: './region-detail.component.html',
  styleUrls: ['./region-detail.component.css']
})
export class RegionDetailComponent implements OnInit {
  region: RegionDetailModel | null = null;
  region$: Observable<RegionDetailModel | null>;
  loading$: Observable<boolean>;
  destroy$ = new Subject<void>();
  constructor(
    private _route: ActivatedRoute,
    private _store: Store
  ) {

    this._store.select(selectRegionDetail)
      .pipe(takeUntil(this.destroy$))
      .subscribe((region) => {
        this.region = region;
      });
    this.loading$ = this._store.select(selectLoading);
    this.region$ = this._store.select(selectRegionDetail);

  }

  ngOnInit(): void {
    this._route.paramMap
      .pipe(takeUntil(this.destroy$))
      .subscribe(this.subscribeFn);

  }

  ngOnDestory(): void {
    this.destroy$.next();
    this.destroy$.unsubscribe();
  }
  private subscribeFn = (param: ParamMap): void => {
    const regionId = +(param.get('regionId') || '0');
    if (regionId !== 0) {
      console.log(regionId);
      this._store.dispatch(readOne({ regionId: regionId }))
    }
  }
}
