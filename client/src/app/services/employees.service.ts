import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AppConfig } from '../app.config';
import { EmployeeCreateModel } from '../models/employees/employee-create.model';
import { EmployeeDetailModel } from '../models/employees/employee-detail.model';
import { EmployeeUpdateModel } from '../models/employees/employee-update.model';
import { EmployeeModel } from '../models/employees/employee.model';

@Injectable({
  providedIn: 'root'
})
export class EmployeesService {
  private _baseURL: string;
  constructor(appConfig: AppConfig, private _client: HttpClient) {
    this._baseURL = `${appConfig.apiEndpoint}/employees`;
  }

  public getAll(): Observable<EmployeeModel[]> {
    return this._client.get<EmployeeModel[]>(`${this._baseURL}/`);
  }

  public getOne(employeeId:number):Observable<EmployeeDetailModel>{
    return this._client.get<EmployeeDetailModel>(`${this._baseURL}/${employeeId}`);
  }

  public createOne(employee:EmployeeCreateModel):Observable<EmployeeModel>{
    return this._client.post<EmployeeModel>(`${this._baseURL}/`,employee);
  }

  public updateOne(employee:EmployeeUpdateModel):Observable<EmployeeModel>{
    return this._client.put<EmployeeModel>(`${this._baseURL}/`,employee);
  }

  public deleteOne(employeeId:number):Observable<void>{
    return this._client.delete<void>(`${this._baseURL}/${employeeId}`);
  }

}
