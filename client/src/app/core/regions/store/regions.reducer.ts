import { state } from "@angular/animations"
import { createReducer, createSelector, on } from "@ngrx/store"
import { Action } from "rxjs/internal/scheduler/Action"
import { RegionCreateModel } from "src/app/models/regions/region-create.model"
import { RegionModel } from "src/app/models/regions/region.model"
import * as RegionsActions from "./regions.actions"


let updateItemInArray = function (array: RegionModel[], region: RegionModel): RegionModel[] {
    let temp = [...array];
    let i = temp.findIndex((r) => r.regionId === region.regionId);
    temp.splice(i, 1, ...[region]);
    return temp;
}


export interface RegionsState {
    regions: RegionModel[]
    loading: boolean
    error: Error | null
}

const initialState: RegionsState = {
    regions: [],
    loading: false,
    error: null
}

export const reducer = createReducer(initialState,
    on(RegionsActions.readAll, (state) => {
        return { ...state, loading: true }
    }),
    on(RegionsActions.createOne, (state, action) => {
        return { ...state, loading: true }
    }),
    on(RegionsActions.deleteOne, (state, action) => {
        return { ...state, loading: true }
    }),
    on(RegionsActions.updateOne, (state, action) => {
        return { ...state, loading: true }
    }),
    on(RegionsActions.readAllSuccess, (state, action) => {
        return { ...state, loading: false, regions: action.regions }
    }),
    on(RegionsActions.readAllFailure, (state, action) => {
        return { ...state, loading: false, error: action.error }
    }),
    on(RegionsActions.createOneSuccess, (state, action) => {
        return { ...state, loading: false, regions: [...state.regions, action.region] }
    }),
    on(RegionsActions.createOneFailure, (state, action) => {
        return { ...state, loading: false, error: action.error }
    }),
    on(RegionsActions.updateOneSuccess, (state, action) => {
        let ar = updateItemInArray(state.regions, action.region)
        return { ...state, loading: false, regions: ar }
    }),
    on(RegionsActions.updateOneFailure, (state, action) => {
        return { ...state, loading: false, error: action.error }
    }),
    on(RegionsActions.deleteOneSuccess, (state, action) => {
        let index = state.regions.findIndex((r) => r.regionId === action.regionId);
        let ar = [...state.regions];
        ar.splice(index,1);
        return { ...state, loading: false, regions: ar }
    }),
    on(RegionsActions.deleteOneFailure, (state, action) => {
        return { ...state, loading: false, error: action.error }
    })
);

// export const selectAllRegions = (state: RegionsState) => state.regions;
// export const selectLoading = (state: RegionsState) => state.loading;
