import { ActionReducerMap, MetaReducer } from "@ngrx/store"
import { LocationsState } from "./locations.reducer"
import { reducer as locationReducer } from "./locations.reducer"
export interface LocationsSharedState{
    locations:LocationsState
}

export const reducers:ActionReducerMap<LocationsSharedState>={
    locations:locationReducer
};
export const metaReducers:MetaReducer<LocationsSharedState>[]=[];