import { ActionReducerMap, MetaReducer } from "@ngrx/store";
import * as FromReducer from "./regions.reducer";

export interface State {
    regions: FromReducer.RegionsState
}

export const reducers: ActionReducerMap<State> = {
    regions: FromReducer.reducer
};
export const metaReducers: MetaReducer<State>[] = [];