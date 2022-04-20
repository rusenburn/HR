import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AppConfig } from '../app.config';

@Injectable({
  providedIn: 'root'
})
export class JobHistoriesService {
  private _baseURL: string;
  constructor(appconfig: AppConfig, private _client: HttpClient) {
    this._baseURL = `${appconfig.apiEndpoint}/job-histories`;
  }
}