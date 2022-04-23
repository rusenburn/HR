import { createFeatureSelector, createSelector } from "@ngrx/store";
import { RegionsState } from "./regions.reducer";
import * as FromRegionsState from "./regions.state";

const _selectAllRegions = (state: RegionsState) => state.regions;
const _selectLoading = (state: RegionsState) => state.loading;
const _selectRegionDetail = (state: RegionsState) => state.regionDetail;

export const selectSharedRegionState = createFeatureSelector<FromRegionsState.State>("[REGIONS]");
export const selectRegionState = createSelector(
  selectSharedRegionState,
  (sharedRegionFeatureState) => sharedRegionFeatureState.regions
);
export const selectAllRegions = createSelector(
  selectRegionState,
  _selectAllRegions
)

export const selectLoading = createSelector(
  selectRegionState,
  _selectLoading
)

export const selectRegionDetail = createSelector(
  selectRegionState,
  _selectRegionDetail
)