import { createReducer, on } from "@ngrx/store";
import * as AccountActions from "./account.actions";

export interface AccountState {
    redirectURl: string,
    username: string,
    error: Error | null
    loading: boolean
    loggedIn: boolean
}
const initialState: AccountState = {
    redirectURl: "/",
    username: "",
    error: null,
    loading: false,
    loggedIn: false,
};
export const reducer = createReducer(initialState,
    on(AccountActions.login,
        AccountActions.register,
        (state) => {
            return { ...state, loading: true };
        }),
    on(AccountActions.loginFailure,
        AccountActions.registerFailure, (state, action) => {
            return { ...state, error: action.error };
        }),
    on(AccountActions.setLoggingInfo, (state, action) => {
        return { ...state, username: action.username, loggedIn: action.loggedIn };
    }),
    on(AccountActions.tokenExpired, (state, action) => {
        return { ...state, redirectURl: action.redirectURL, loggedIn: false, username: "" };
    })
);