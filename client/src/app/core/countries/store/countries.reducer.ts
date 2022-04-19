
import { createReducer, on } from "@ngrx/store";
import { CountryModel } from "src/app/models/countries/country.model";
import * as CountriesActions from "./countries.action";

let cloneArrayWithUpdatedItem = function (countries: CountryModel[], country: CountryModel): CountryModel[] {
    let temp = [...countries];
    let i = temp.findIndex((c) => c.countryId === country.countryId);
    temp.splice(i, 1, ...[country]);
    return temp;
}

export interface CountriesState {
    countries: CountryModel[];
    loading: boolean;
    error: Error | null;
}

const initialState: CountriesState = {
    countries: [],
    loading: false,
    error: null
}

export const reducer = createReducer(initialState,
    on(CountriesActions.readAll,
        CountriesActions.createOne,
        CountriesActions.deleteOne,
        CountriesActions.updateOne,
        (state) => {
            return { ...state, loading: true };
        }),
    on(CountriesActions.readAllFailure,
        CountriesActions.deleteOneFailure,
        CountriesActions.createOneFailure,
        CountriesActions.updateOneFailure,
        (state, action) => {
            return { ...state, loading: false, error: action.error };
        }),
    on(CountriesActions.readAllSuccess, (state, action) => {
        return { ...state, loading: false, countries: action.countries }
    }),
    on(CountriesActions.createOneSuccess, (state, action) => {
        return { ...state, loading: false, countries: [...state.countries, action.country] }
    }),
    on(CountriesActions.updateOneSuccess, (state, action) => {
        const countries = cloneArrayWithUpdatedItem(state.countries, action.country);
        return { ...state, loading: false, countries }
    }),
    on(CountriesActions.deleteOneSuccess, (state, action) => {
        let index = state.countries.findIndex(c => c.countryId === action.countryId);
        let countries = [...state.countries]
        countries.splice(index, 1);
        return { ...state, loading: false, countries }
    }),
);

