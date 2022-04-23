import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Router } from '@angular/router';
import { CountryModel } from 'src/app/models/countries/country.model';

@Component({
  selector: 'app-countries-table',
  templateUrl: './countries-table.component.html',
  styleUrls: ['./countries-table.component.css']
})
export class CountriesTableComponent {
  @Input()
  countries: CountryModel[] = [];

  @Output()
  editCountry = new EventEmitter<CountryModel>();
  displayedColumns: string[] = ["countryId", "countryName", "regionId", "actions"];
  constructor(private _router: Router) { }

  public edit(country: CountryModel) {
    this.editCountry.emit(country);
  }

  public detail(countryId: number): void {
    this._router.navigate(["/countries", countryId]);
  }
}
