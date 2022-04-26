import { state } from "@angular/animations"
import { createReducer, createSelector, on } from "@ngrx/store"
import { Action } from "rxjs/internal/scheduler/Action"
import { RegionCreateModel } from "src/app/models/regions/region-create.model"
import { RegionDetailModel } from "src/app/models/regions/region-detail.model"
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
    error: Error | null,
    regionDetail: RegionDetailModel | null
}

const initialState: RegionsState = {
    regions: [],
    loading: false,
    error: null,
    regionDetail: null
}

export const reducer = createReducer(initialState,
    on(RegionsActions.readAll,
        RegionsActions.createOne,
        RegionsActions.deleteOne,
        RegionsActions.updateOne,
        RegionsActions.readOne,
        (state) => {
            return { ...state, loading: true }
        }),
    on(RegionsActions.readAllFailure,
        RegionsActions.createOneFailure,
        RegionsActions.updateOneFailure,
        RegionsActions.deleteOneFailure,
        RegionsActions.readOneFailure,
        (state, action) => {
            return { ...state, loading: false, error: action.error }
        }
    ),
    on(RegionsActions.readAllSuccess, (state, action) => {
        return { ...state, loading: false, regions: action.regions }
    }),
    on(RegionsActions.createOneSuccess, (state, action) => {
        return { ...state, loading: false, regions: [...state.regions, action.region] }
    }),
    on(RegionsActions.updateOneSuccess, (state, action) => {
        let ar = updateItemInArray(state.regions, action.region)
        let regionDetail = state.regionDetail;
        if (action.region.regionId === state.regionDetail?.regionId) {
            regionDetail = { ...state.regionDetail, ...action.region };
        }
        return { ...state, loading: false, regions: ar, regionDetail };
    }),
    on(RegionsActions.deleteOneSuccess, (state, action) => {
        let index = state.regions.findIndex((r) => r.regionId === action.regionId);
        let ar = [...state.regions];
        ar.splice(index, 1);
        return { ...state, loading: false, regions: ar }
    }),
    on(RegionsActions.readOneSuccess, (state, action) => {
        const index = state.regions.findIndex((r) => r.regionId === action.region.regionId);
        const ar = [...state.regions];
        if (index !== -1) { // case does not exist
            ar[index] = { ...ar[index], ...action.region };
        }
        return { ...state, loading: false, regionDetail: { ...action.region } }
    })
);