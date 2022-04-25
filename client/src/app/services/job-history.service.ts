import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AppConfig } from '../app.config';
import { JobHistoryCreateModel } from '../models/job-histories/job-history-create.model';
import { JobHistoryDetailModel } from '../models/job-histories/job-history-detail.model';
import { JobHistoryUpdateModel } from '../models/job-histories/job-history-update';

@Injectable({
  providedIn: 'root'
})
export class JobHistoryService {
  private _baseURL: string;
  constructor(appConfig: AppConfig, private _client: HttpClient) {
    this._baseURL = appConfig.apiEndpoint + '/job-history';
  }

  public getAll(): Observable<JobHistoryDetailModel[]> {
    return this._client.get<JobHistoryDetailModel[]>(`${this._baseURL}/`);
  }

  public getLast(employeeId: number): Observable<JobHistoryDetailModel> {
    return this._client.get<JobHistoryDetailModel>(`${this._baseURL}/${employeeId}/`);
  }

  public createOne(jobHistory: JobHistoryCreateModel): Observable<JobHistoryDetailModel> {
    return this._client.post<JobHistoryDetailModel>(`${this._baseURL}/`, jobHistory);
  }

  public updateOne(jobHistory: JobHistoryUpdateModel): Observable<JobHistoryDetailModel> {
    return this._client.put<JobHistoryDetailModel>(`${this._baseURL}/`, jobHistory);
  }

  public deleteOne(employeeId: number, startDate: string): Observable<void> {
    return this._client.delete<void>(`${this._baseURL}/${employeeId}/${startDate}`);
  }
}
