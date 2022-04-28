import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { RegionModel } from 'src/app/models/regions/region.model';
import { selectAllRegions, selectLoading } from 'src/app/stores/region/regions.selectors';
import * as RegionActions from 'src/app/stores/region/regions.actions';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RegionUpdateModel } from 'src/app/models/regions/region-update.model';
import { MatDialog } from '@angular/material/dialog';
import { RegionUpsertDialogComponent } from '../region-upsert-dialog/region-upsert-dialog.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.css']
})
export class IndexComponent implements OnInit {
  regions$: Observable<RegionModel[]>;
  loading$: Observable<boolean>;

  displayedColumns: string[] = ["regionName", "regionId", "actions"]
  constructor(
    private _store: Store,
    private _dialog: MatDialog,
    private _router: Router
  ) {
    this.regions$ = this._store.select(selectAllRegions);
    this.loading$ = this._store.select(selectLoading);
  }

  ngOnInit(): void {
    this._store.dispatch(RegionActions.readAll({ skip: 0, limit: 2147483647 }));
  }

  openDialog(region: RegionUpdateModel | null): void {
    const di = this._dialog.open(RegionUpsertDialogComponent, {
      width: '600px',
      data: region
    });
  }
  detail(regionId: number): void {
    this._router.navigate(["/regions", regionId])
  }
}
