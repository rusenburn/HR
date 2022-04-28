import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AppConfig } from '../app.config';
import { CountryCreateModel } from '../models/countries/country-create.model';
import { CountryDetailModel } from '../models/countries/country-detail.model';
import { CountryQueryModel } from '../models/countries/country-query.model';
import { CountryUpdateModel } from '../models/countries/country-update.model';
import { CountryModel } from '../models/countries/country.model';

@Injectable({
  providedIn: 'root'
})
export class CountriesService {
  private _baseURL: string;
  constructor(appConfig: AppConfig, private _client: HttpClient) {
    this._baseURL = `${appConfig.apiEndpoint}/countries`;
  }

  public getAll(query:CountryQueryModel): Observable<CountryModel[]> {
    const params = new HttpParams({fromObject:{...query}});
    return this._client.get<CountryModel[]>(`${this._baseURL}/`,{params});
  }

  public getOne(countryId: number): Observable<CountryDetailModel> {
    return this._client.get<CountryDetailModel>(`${this._baseURL}/${countryId}`);
  }

  public createOne(country: CountryCreateModel): Observable<CountryModel> {
    return this._client.post<CountryModel>(`${this._baseURL}/`, country);
  }

  public updateOne(country: CountryUpdateModel): Observable<CountryModel> {
    return this._client.put<CountryModel>(`${this._baseURL}/`, country);
  }

  public deleteOne(countryId: number): Observable<void> {
    return this._client.delete<void>(`${this._baseURL}/${countryId}`);
  }
}
