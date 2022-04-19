import { createFeatureSelector, createSelector } from "@ngrx/store";
import { CountriesState } from "./countries.reducer";
import * as FromCountriesState from "./countries.state";

const _selectAllCountries = (state: CountriesState) => state.countries;
const _selectLoading = (state: CountriesState) => state.loading;

export const selectSharedCountriesState = createFeatureSelector<FromCountriesState.State>("[COUNTRIES]");
export const selectCountriesState = createSelector(
    selectSharedCountriesState,
    (sharedCountriesState) => sharedCountriesState.countries
);

export const selectAllCountries = createSelector(
    selectCountriesState,
    _selectAllCountries
);
export const selectLoading = createSelector(
    selectCountriesState,
    _selectLoading
);