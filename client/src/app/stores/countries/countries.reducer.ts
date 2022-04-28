import { createReducer, on } from "@ngrx/store";
import { CountryDetailModel } from "src/app/models/countries/country-detail.model";
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
    countryDetail: CountryDetailModel | null;
    pageIndex: number;
    pageSize: number;
    sortActive: string;
    ascending: boolean;
    byRegion: number | null;
}

const initialState: CountriesState = {
    countries: [],
    loading: false,
    error: null,
    countryDetail: null,
    pageIndex: 0,
    pageSize: 20,
    ascending: true,
    sortActive: "countryId",
    byRegion: null
}

export const reducer = createReducer(initialState,
    on(CountriesActions.readAll,
        CountriesActions.createOne,
        CountriesActions.deleteOne,
        CountriesActions.updateOne,
        CountriesActions.readOne,
        (state) => {
            return { ...state, loading: true };
        }),
    on(CountriesActions.readAllFailure,
        CountriesActions.deleteOneFailure,
        CountriesActions.createOneFailure,
        CountriesActions.updateOneFailure,
        CountriesActions.readOneFailure,
        (state, action) => {
            return { ...state, loading: false, error: action.error };
        }),
    on(CountriesActions.updatePagination, (state, action) => {
        return { ...state, pageIndex: action.pageIndex, pageSize: action.pageSize };
    }),
    on(CountriesActions.updateSort, (state, action) => {
        return { ...state, sortActive: action.active, ascending: action.asc };
    }),
    on(CountriesActions.clearRegionFilter, (state) => {
        return { ...state, byRegion: null };
    }),
    on(CountriesActions.setRegionFilter, (state, action) => {
        return { ...state, byRegion: action.regionId };
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
    on(CountriesActions.readOneSuccess, (state, action) => {
        const index = state.countries.findIndex(c => c.countryId === action.country.countryId);
        let countries = state.countries;
        if (index !== -1) {
            countries = [...state.countries];
            countries.splice(index, 1, action.country);
        }
        return { ...state, loading: false, countryDetail: action.country, countries }
    })
);

