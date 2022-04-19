import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { RegionModel } from 'src/app/models/regions/region.model';
import { RegionsService } from 'src/app/services/regions.service';
import { selectAllRegions, selectLoading } from '../store/regions.selectors';
import * as RegionActions from '../store/regions.actions';
// import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RegionUpdateModel } from 'src/app/models/regions/region-update.model';
import { MatDialog } from '@angular/material/dialog';
import { RegionUpsertDialogComponent } from '../region-upsert-dialog/region-upsert-dialog.component';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.css']
})
export class IndexComponent implements OnInit {
  regions$: Observable<RegionModel[]>;
  loading$: Observable<boolean>;
  regionForm: FormGroup;
  displayedColumns:string[]=["regionName","regionId","actions"]
  constructor(
    private _regions: RegionsService,
    private _store: Store,
    // private _route: ActivatedRoute,
    private _fb: FormBuilder,
    private _dialog: MatDialog
  ) {
    // this.regions$ = this._regions.getAll()
    this.regions$ = this._store.select(selectAllRegions);
    this.loading$ = this._store.select(selectLoading);
    this.regionForm = this._fb.group({
      regionName: ['', [Validators.required, Validators.maxLength(52)]]
    })
  }

  ngOnInit(): void {
    this._store.dispatch(RegionActions.readAll());
  }
  
  openDialog(region: RegionUpdateModel | null): void {
    const di = this._dialog.open(RegionUpsertDialogComponent, {
      width: '600px',
      data: region
    });
  }
}
