import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { RegionDetailModel } from 'src/app/models/regions/region-detail.model';
import { readOne } from '../store/regions.actions';
import { selectLoading, selectRegionDetail } from '../store/regions.selectors';

@Component({
  selector: 'app-region-detail',
  templateUrl: './region-detail.component.html',
  styleUrls: ['./region-detail.component.css']
})
export class RegionDetailComponent implements OnInit {
  region: RegionDetailModel | null = null;
  subs: Subscription[] = [];
  region$: Observable<RegionDetailModel | null>;
  loading$: Observable<boolean>;
  constructor(
    private _route: ActivatedRoute,
    private _store: Store
  ) {

    const sub = this._store.select(selectRegionDetail).subscribe((region) => {
      this.region = region;
    });

    this.subs.push(sub);
    this.loading$ = this._store.select(selectLoading);
    this.region$ = this._store.select(selectRegionDetail);

  }

  ngOnInit(): void {
    const a = this._route.paramMap.subscribe(this.subscribeFn);
    this.subs.push(a);
  }

  ngOnDestory(): void {
    for (let sub of this.subs) {
      if (!sub.closed) sub.unsubscribe();
    }
  }
  private subscribeFn = (param: ParamMap): void => {
    const regionId = +(param.get('regionId') || '0');
    if (regionId !== 0) {
      console.log(regionId);
      this._store.dispatch(readOne({ regionId: regionId }))
    }
  }
}
