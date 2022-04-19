import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AppConfig } from '../app.config';
import { DepartmentCreateModel } from '../models/departments/department-create.model';
import { DepartmentDetailModel } from '../models/departments/department-detail.model';
import { DepartmentUpdateModel } from '../models/departments/department-update.model';
import { DepartmentModel } from '../models/departments/department.model';

@Injectable({
  providedIn: 'root'
})
export class DepartmentsService {
  _baseURL: string;
  constructor(appConfig: AppConfig, private _client: HttpClient) {
    this._baseURL = `${appConfig.apiEndpoint}/departments`;
  }

  public getAll(): Observable<DepartmentModel[]> {
    return this._client.get<DepartmentModel[]>(`${this._baseURL}/`);
  }

  public getOne(departmentId: number): Observable<DepartmentDetailModel> {
    return this._client.get<DepartmentDetailModel>(`${this._baseURL}/${departmentId}`);
  }

  public createOne(department: DepartmentCreateModel): Observable<DepartmentModel> {
    return this._client.post<DepartmentModel>(`${this._baseURL}/`, department);
  }
  public updateOne(department: DepartmentUpdateModel): Observable<DepartmentModel> {
    return this._client.put<DepartmentModel>(`${this._baseURL}/`, department);
  }

  public deleteOne(departmentId: number): Observable<void> {
    return this._client.delete<void>(`${this._baseURL}/${departmentId}`);
  }
}
