import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from "@angular/router";
import { JwtHelperService } from "@auth0/angular-jwt";
import { Store } from "@ngrx/store";
import { Observable } from "rxjs";
import { LocalStorageService } from "../utilities/local-storage.service";
import { tokenExpired } from "../store/account/account.actions";

@Injectable({providedIn:'root'})
export class AuthGuard implements CanActivate {
    constructor(
        private _router: Router,
        private _jwtHelper: JwtHelperService,
        private _storageService: LocalStorageService,
        private _store: Store) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
        const token = this._storageService.getJWTToken();
        if (token && !this._jwtHelper.isTokenExpired(token)) {
            return true;
        }
        this._store.dispatch(tokenExpired({redirectURL:state.url}));
        this._router.navigate(['/account/login'])
        return false;
    }
}