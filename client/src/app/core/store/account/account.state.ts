import { ActionReducerMap, MetaReducer } from "@ngrx/store";
import { AccountState, reducer as accountReducer } from "./account.reducer";

export interface AccountFeatureState {
    account: AccountState
};

export const reducers: ActionReducerMap<AccountFeatureState> = {
    account: accountReducer
};

export const metaReducers: MetaReducer<AccountFeatureState>[] = [];