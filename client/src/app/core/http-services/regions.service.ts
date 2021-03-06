import { Injectable } from '@angular/core';
import { AppConfig } from '../../app.config';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RegionModel } from '../../models/regions/region.model';
import { RegionDetailModel } from '../../models/regions/region-detail.model';
import { RegionUpdateModel } from '../../models/regions/region-update.model';
import { RegionCreateModel } from '../../models/regions/region-create.model';
import { RegionQueryModel } from '../../models/regions/region-query.model';


@Injectable({
  providedIn: 'root'
})
export class RegionsService {
  private _baseURL: string
  constructor(appConfig: AppConfig, private _client: HttpClient) {
    this._baseURL = `${appConfig.apiEndpoint}/regions`
  }

  public getAll(query:RegionQueryModel): Observable<RegionModel[]> {
    const params = new HttpParams({fromObject:{...query}});
    return this._client.get<RegionModel[]>(`${this._baseURL}/`,{params:params});
  }

  public getOne(regionId: number): Observable<RegionDetailModel> {
    return this._client.get<RegionDetailModel>(`${this._baseURL}/${regionId}`)
  }

  public createOne(region: RegionCreateModel): Observable<RegionDetailModel> {
    return this._client.post<RegionDetailModel>(`${this._baseURL}/`, region);
  }
  public updateOne(region: RegionUpdateModel): Observable<RegionDetailModel> {
    return this._client.put<RegionDetailModel>(`${this._baseURL}/`, region);
  }
  public deleteOne(regionId: number): Observable<void> {
    return this._client.delete<void>(`${this._baseURL}/${regionId}`);
  }
}
