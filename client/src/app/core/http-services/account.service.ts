import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AppConfig } from 'src/app/app.config';
import { AccountLoginModel } from 'src/app/models/account/account-login';
import { AccountRegisterModel } from 'src/app/models/account/account-register';
import { TokenModel } from 'src/app/models/account/token';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  private _baseURL:string;
  constructor(appConfig:AppConfig,private _client:HttpClient) {
    this._baseURL = `${appConfig.apiEndpoint}/users`;
   }

   public register(register:AccountRegisterModel):Observable<void>
   {
     console.log(register);
     return this._client.post<void>(`${this._baseURL}/register`,register);
   }

   public login(credentials:FormData):Observable<TokenModel>{
     return this._client.post<TokenModel>(`${this._baseURL}/login`,credentials);
   }
}
