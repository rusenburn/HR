import { Component, EventEmitter, Input, Output, ViewChild, } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { Sort } from '@angular/material/sort';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable, } from 'rxjs';
import { defaultRegionQuery } from 'src/app/models/regions/region-query.model';
import { RegionModel } from 'src/app/models/regions/region.model';
import { openForm, paginationChanged, readAll, sortChanged, textFilterChanged } from 'src/app/stores/region/regions.actions';
import {
  selectRegionPageIndex,
  selectRegionPageSize,
  selectAllRegionsLength,
  selectRegionsSortedSlice,
  selectFilteredRegionsLength
} from 'src/app/stores/region/regions.selectors';

@Component({
  selector: 'app-regions-table',
  templateUrl: './regions-table.component.html',
  styleUrls: ['./regions-table.component.css']
})
export class RegionsTableComponent {
  @Input()
  regions: RegionModel[] = [];
  pageIndex$: Observable<number>;
  pageSize$: Observable<number>;
  displayedColumns: string[] = ["regionName", "regionId", "actions"];
  regions$: Observable<RegionModel[]>;
  length$: Observable<number>;
  textFilter:string="";
  constructor(
    private _router: Router,
    private _store: Store
  ) {
    this._store.dispatch(readAll({ ...defaultRegionQuery }));
    this.pageIndex$ = this._store.select(selectRegionPageIndex);
    this.pageSize$ = this._store.select(selectRegionPageSize);
    this.regions$ = this._store.select(selectRegionsSortedSlice);
    this.length$ = this._store.select(selectFilteredRegionsLength);
  }

  public edit(region: RegionModel) {
    this._store.dispatch(openForm({ region }));
  }

  public detail(regionId: number) {
    this._router.navigate(["/regions", regionId]);
  }

  public onPageEvent(event: PageEvent) {
    this._store.dispatch(paginationChanged({ ...event }));
  }

  public sortChange(sortState: Sort) {
    this._store.dispatch(sortChanged({ active: sortState.active, asc: sortState.direction === "asc" }))
  }

  public textFilterChange(){
    this._store.dispatch(textFilterChanged({textFilter:this.textFilter}))
  }
}
