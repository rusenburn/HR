import { createFeatureSelector, createSelector } from "@ngrx/store";
import { LocationsState } from "./locations.reducer";
import { LocationsSharedState } from "./locations.state";

const _selectAllLocations = (state:LocationsState)=>state.locations;
const _selectLoading = (state:LocationsState)=>state.loading;

export const selectSharedLocationsState = createFeatureSelector<LocationsSharedState>("[LOCATIONS]");
export const selectLocationState = createSelector(
    selectSharedLocationsState,
    (sharedState)=>sharedState.locations
);

export const selectAllLocations = createSelector(
    selectLocationState,
    _selectAllLocations
);

export const selectLoading = createSelector(
    selectLocationState,
    _selectLoading
)
