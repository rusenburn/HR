import { createReducer, on } from "@ngrx/store";
import { LocationModel } from "src/app/models/locations/location.model";
import * as LocationsActions from "./locations.actions";

let cloneArrayWithUpdatedItem = function (countries: LocationModel[], country: LocationModel): LocationModel[] {
    let temp = [...countries];
    let i = temp.findIndex((c) => c.countryId === country.countryId);
    temp.splice(i, 1, ...[country]);
    return temp;
}
export interface LocationsState {
    locations: LocationModel[];
    loading: boolean;
    error: Error | null;
}

const initialState: LocationsState = {
    locations: [],
    loading: false,
    error: null
}

export const reducer = createReducer(initialState,
    on(LocationsActions.readAll,
        LocationsActions.createOne,
        LocationsActions.updateOne,
        LocationsActions.deleteOne,
        (state) => {
            return { ...state, loading: true }
        }),
    on(
        LocationsActions.readAllFailure,
        LocationsActions.deleteOneFailure,
        LocationsActions.createOneFailure,
        LocationsActions.updateOneFailure,
        (state, action) => {
            return { ...state, loading: false, error: action.error }
        }
    ),
    on(
        LocationsActions.createOneSuccess,
        (state, action) => {
            return { ...state, loading: false, locations: [...state.locations, action.location] }
        }
    ),
    on(
        LocationsActions.updateOneSuccess,
        (state, action) => {
            const locations = cloneArrayWithUpdatedItem(state.locations, action.location)
            return { ...state, loading: false, locations }
        }),
    on(
        LocationsActions.deleteOneSuccess,
        (state, action) => {
            let locations = [...state.locations];
            let index = locations.findIndex(c => c.locationId === action.locationId);
            locations.splice(index, 1);
            return { ...state, loading: false, locations }
        }
    )

)