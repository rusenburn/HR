import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Router } from '@angular/router';
import { RegionModel } from 'src/app/models/regions/region.model';

@Component({
  selector: 'app-regions-table',
  templateUrl: './regions-table.component.html',
  styleUrls: ['./regions-table.component.css']
})
export class RegionsTableComponent {
  @Input()
  regions: RegionModel[] = [];
  @Output()
  editRegion = new EventEmitter<RegionModel>();

  displayedColumns: string[] = ["regionName", "regionId", "actions"];
  constructor(
    private _router: Router
  ) { }

  public edit(region: RegionModel) {
    this.editRegion.emit(region);
  }

  public detail(regionId: number) {
    this._router.navigate(["/regions", regionId]);
  }
}
