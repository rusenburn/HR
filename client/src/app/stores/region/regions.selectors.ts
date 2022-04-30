import { createFeatureSelector, createSelector } from "@ngrx/store";
import { RegionModel } from "src/app/models/regions/region.model";
import { RegionsState } from "./regions.reducer";
import * as FromRegionsState from "./regions.state";

const _selectAllRegions = (state: RegionsState) => state.regions;
const _selectLoading = (state: RegionsState) => state.loading;
const _selectRegionDetail = (state: RegionsState) => state.regionDetail;
const _selectError = (state: RegionsState) => state.error;
const _selectPageIndex = (state: RegionsState) => state.pageIndex;
const _selectPageSize = (state: RegionsState) => state.pageSize;
const _selectSortActive = (state: RegionsState) => state.sortActive;
const _selectAscending = (state: RegionsState) => state.ascending;
const _selectDialogRefId = (state:RegionsState)=>{
  return state.dialogRefId
};
const _sort = (regions: RegionModel[], active: string, asc: boolean): RegionModel[] => {
  const res = [...regions];
  switch (active) {
    case "regionId":
      res.sort((a, b) => a.regionId - b.regionId);
      break;
    case "regionName":
      res.sort((a, b) => a.regionName < b.regionName ? -1 : a.regionName > b.regionName ? 1 : 0);
      break;
    default:
      res.sort((a, b) => a.regionId - b.regionId);
  }
  if (asc) return res;
  return res.reverse();
};



export const selectSharedRegionState = createFeatureSelector<FromRegionsState.State>("[REGIONS]");
export const selectRegionState = createSelector(
  selectSharedRegionState,
  (sharedRegionFeatureState) => sharedRegionFeatureState.regions
);

export const selectDialogRefId= createSelector(
  selectRegionState,
  _selectDialogRefId
);

export const selectAllRegions = createSelector(
  selectRegionState,
  _selectAllRegions
);

export const selectLoading = createSelector(
  selectRegionState,
  _selectLoading
);

export const selectRegionDetail = createSelector(
  selectRegionState,
  _selectRegionDetail
);

export const selectError = createSelector(
  selectRegionState,
  _selectError
);
export const selectRegionPageIndex = createSelector(
  selectRegionState,
  _selectPageIndex
);
export const selectRegionPageSize = createSelector(
  selectRegionState,
  _selectPageSize
);

export const selectRegionsLength = createSelector(
  selectAllRegions,
  (regions) => regions.length
);


export const selectSortActive = createSelector(
  selectRegionState,
  _selectSortActive
)

export const selectAscending = createSelector(
  selectRegionState,
  _selectAscending
)
export const selectAllRegionsSorted = createSelector(
  selectAllRegions,
  selectSortActive,
  selectAscending,
  _sort,
);

export const selectRegionsSortedSlice = createSelector(
  selectAllRegionsSorted,
  selectRegionPageIndex,
  selectRegionPageSize,
  (regions, pageIndex, pageSize) => {
    const start = (pageIndex) * pageSize;
    const end = start + pageSize;
    const sl = regions.slice(start, end);
    return [...sl];
  }
);