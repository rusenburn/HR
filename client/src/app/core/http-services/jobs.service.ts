import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AppConfig } from '../../app.config';
import { JobCreateModel } from '../../models/jobs/job-create.model';
import { JobDetailModel } from '../../models/jobs/job-detail.model';
import { JobQueryModel } from '../../models/jobs/job-query.model';
import { JobUpdateModel } from '../../models/jobs/job-update.model';
import { JobModel } from '../../models/jobs/job.model';

@Injectable({
  providedIn: 'root'
})
export class JobsService {
  public _baseURL: string;
  constructor(appConfig: AppConfig, private _client: HttpClient) {
    this._baseURL = `${appConfig.apiEndpoint}/jobs`;
  }

  public getAll(query: JobQueryModel): Observable<JobModel[]> {
    const params = new HttpParams({ fromObject: { ...query } });
    return this._client.get<JobModel[]>(`${this._baseURL}/`, { params });
  }

  public getOne(jobId: number): Observable<JobDetailModel> {
    return this._client.get<JobDetailModel>(`${this._baseURL}/${jobId}`);
  }

  public createOne(job: JobCreateModel): Observable<JobModel> {
    return this._client.post<JobModel>(`${this._baseURL}/`, job);
  }

  public updateOne(job: JobUpdateModel): Observable<JobModel> {
    return this._client.put<JobModel>(`${this._baseURL}/`, job);
  }

  public deleteOne(jobId: number): Observable<void> {
    return this._client.delete<void>(`${this._baseURL}/${jobId}`);
  }
}
