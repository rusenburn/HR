import { ActionReducerMap, MetaReducer } from "@ngrx/store";
import * as FromReducer from "./countries.reducer";

export interface State {
    countries: FromReducer.CountriesState;
};

export const reducers: ActionReducerMap<State> = {
    countries: FromReducer.reducer
};
export const metaReducers: MetaReducer<State>[] = [];