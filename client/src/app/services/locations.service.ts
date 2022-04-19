import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AppConfig } from '../app.config';
import { LocationCreateModel } from '../models/locations/location-create.model';
import { locationDetailModel } from '../models/locations/location-detail.model';
import { LocationUpdateModel } from '../models/locations/location-update.model';
import { LocationModel } from '../models/locations/location.model';

@Injectable({
  providedIn: 'root'
})
export class LocationsService {
  private _baseURL: string;
  constructor(
    appConfig: AppConfig, private _client: HttpClient
  ) {
    this._baseURL = `${appConfig.apiEndpoint}/locations`;
  }

  public getAll():Observable<LocationModel[]>{
    return this._client.get<LocationModel[]>(`${this._baseURL}/`);
  }

  public getOne(locationId:number):Observable<locationDetailModel>{
    return this._client.get<locationDetailModel>(`${this._baseURL}/${locationId}`);
  }

  public createOne(location:LocationCreateModel):Observable<LocationModel>{
    return this._client.post<LocationModel>(`${this._baseURL}/`,location);
  }

  public updateOne(location:LocationUpdateModel):Observable<LocationModel>{
    return this._client.put<LocationModel>(`${this._baseURL}/`,location);
  }

  public deleteOne(locationId:number):Observable<void>{
    return this._client.delete<void>(`${this._baseURL}/${locationId}`);
  }
}
