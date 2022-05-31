import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { JwtHelperService } from "@auth0/angular-jwt";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { Store } from "@ngrx/store";
import { catchError, exhaustMap, map, of, switchMap, tap } from "rxjs";
import { AccountService } from "../../http-services/account.service";
import { LocalStorageService } from "../../utilities/local-storage.service";
import * as AccountActions from "./account.actions";

@Injectable()
export class AccountAPIEffects {
    constructor(
        private actions$: Actions,
        private _accountService: AccountService,
        private storageService: LocalStorageService,
        private jwt_helper: JwtHelperService) { }

    register$ = createEffect(() => {
        return this.actions$.pipe(
            ofType(AccountActions.register),
            exhaustMap(action => {
                console.log(action.credentials);
                return this._accountService.register(action.credentials).pipe(
                    map(() => {
                        // action.router?.navigate(["/account/login"]);
                        return AccountActions.registerSuccess();
                    }),
                    catchError(error => of(AccountActions.registerFailure(error))))
            })
        );
    });

    // registerSuccess$ = createEffect(() => {
    //     return this.actions$.pipe(
    //         ofType(AccountActions.registerSuccess),
    //         tap(() => { this._router.navigate(["/account/login"]) }),
    //     );
    // })
    login$ = createEffect(() => {
        return this.actions$.pipe(
            ofType(AccountActions.login),
            switchMap(action => {
                return this._accountService.login(action.credentials).pipe(
                    map((token) => AccountActions.loginSuccess(token)),
                    catchError(error => of(AccountActions.loginFailure(error)))
                );
            })
        );
    });

    loginSuccess$ = createEffect(() => {
        return this.actions$.pipe(
            ofType(AccountActions.loginSuccess),
            map(action => {
                this.storageService.SetJWTToken(action.accessToken);
                // const decoded = this.jwt_helper.decodeToken(action.accessToken);
                // console.log(decoded);
                return AccountActions.updateLoggingInfo();
            })
        )
    })

    updateLoggingInfo$ = createEffect(()=>{
        return this.actions$.pipe(
            ofType(AccountActions.updateLoggingInfo),
            map(action=>{
                const decoded = this.jwt_helper.decodeToken();
                console.log(decoded);
                return AccountActions.setLoggingInfo({ username: decoded?.sub ?? "", loggedIn: true });
            })
        )
    })

    logout$ = createEffect(() => {
        return this.actions$.pipe(
            ofType(AccountActions.logout),
            map(() => {
                this.storageService.SetJWTToken("");
                return AccountActions.setLoggingInfo({ username: "", loggedIn: false });
            })
        )
    })
}