import { createFeatureSelector, createSelector } from "@ngrx/store";
import { CountryDetailModel } from "src/app/models/countries/country-detail.model";
import { DepartmentLocationedModel } from "src/app/models/departments/department-locationed";
import { selectAllDepartments } from "../departments/departments.selectors";
import { CountriesState } from "./countries.reducer";
import * as FromCountriesState from "./countries.state";

const _selectAllCountries = (state: CountriesState) => state.countries;
const _selectLoading = (state: CountriesState) => state.loading;
const _selectCountryDetail = (state: CountriesState) => state.countryDetail;
const _selectCountryDepartments =
    (country: CountryDetailModel | null, departments: DepartmentLocationedModel[]) => {
        if (country === null) return [];
        return departments.filter(d => d.location.countryId === country.countryId);
    }
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

export const selectCountryDetail = createSelector(
    selectCountriesState,
    _selectCountryDetail
)

export const selectCountryDepartments = createSelector(
    selectCountryDetail,
    selectAllDepartments,
    _selectCountryDepartments,
)