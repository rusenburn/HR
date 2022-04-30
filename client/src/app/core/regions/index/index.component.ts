import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { RegionModel } from 'src/app/models/regions/region.model';
import { selectAllRegions, selectLoading } from 'src/app/stores/region/regions.selectors';
import { RegionUpdateModel } from 'src/app/models/regions/region-update.model';
import { MatDialog } from '@angular/material/dialog';
import { RegionUpsertDialogComponent } from 'src/app/shared/dialoges/region-upsert-dialog/region-upsert-dialog.component';
import { Router } from '@angular/router';
import { openForm } from 'src/app/stores/region/regions.actions';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.css']
})
export class IndexComponent {
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

  detail(regionId: number): void {
    this._router.navigate(["/regions", regionId])
  }
  createNew(): void {
    this._store.dispatch(openForm({ region: null }));
  }
}
