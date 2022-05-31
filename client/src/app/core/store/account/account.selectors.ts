import { createFeatureSelector, createSelector } from "@ngrx/store";
import { AccountState } from "./account.reducer";
import { AccountFeatureState } from "./account.state";


const _selectLoading = (state: AccountState) => state.loading;
const _selectusername = (state: AccountState) => state.username;
const _selectRedirectURL = (state: AccountState) => state.redirectURl;
const _selectLoggedIn = (state: AccountState) => state.loggedIn;

export const selectAccountFeature = createFeatureSelector<AccountFeatureState>("[ACCOUNT]");
export const selectAccountState = createSelector(
    selectAccountFeature,
    (feature) => feature.account
);

export const selectUsername = createSelector(
    selectAccountState,
    _selectusername
);

export const selectLoading = createSelector(
    selectAccountState,
    _selectLoading
);
export const selectRedirectURL = createSelector(
    selectAccountState,
    _selectRedirectURL
);
export const selectLoggedIn = createSelector(
    selectAccountState,
    _selectLoggedIn
);