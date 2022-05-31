import { Router } from "@angular/router";
import { createAction, props } from "@ngrx/store";
import { AccountRegisterModel } from "src/app/models/account/account-register";
import { TokenModel } from "src/app/models/account/token";


export const register = createAction("[ACCOUNT] Register", props<{ credentials: AccountRegisterModel}>());
export const registerSuccess = createAction("[ACCOUNT] RegisterSuccess");
export const registerFailure = createAction("[ACCOUNT] RegisterFailure", props<{ error: Error | null }>());

export const login = createAction("[ACCOUNT] Login", props<{ credentials: FormData }>());
export const loginSuccess = createAction("[ACCOUNT] LoginSuccess", props<TokenModel>());
export const loginFailure = createAction("[ACCOUNT] LoginFailure", props<{ error: Error }>());

export const tokenExpired = createAction("[ACCOUNT] TokenExpired", props<{ redirectURL: string }>());
export const setLoggingInfo = createAction("[ACCOUNT] SetLoggingInfo", props<{ username: string,loggedIn:boolean }>());
export const updateLoggingInfo = createAction("[ACCOUNT] UpdateLoggingInfo");
export const logout = createAction("[ACCOUNT] Logout");