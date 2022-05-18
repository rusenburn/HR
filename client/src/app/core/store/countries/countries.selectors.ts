import { createFeatureSelector, createSelector } from "@ngrx/store";
import { CountryDetailModel } from "src/app/models/countries/country-detail.model";
import { CountryModel } from "src/app/models/countries/country.model";
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
    };
const _selectPageIndex = (state: CountriesState) => state.pageIndex;
const _selectPageSize = (state: CountriesState) => state.pageSize;
const _selectSortActive = (state: CountriesState) => state.sortActive;
const _selectAscending = (state: CountriesState) => state.ascending;
const _selectByRegion = (state: CountriesState) => state.byRegion;
const _selectDialogId = (state: CountriesState) => state.dialogId;
const _selectTextFilter = (state: CountriesState) => state.textFilter;

const _filterByText = (countries: CountryModel[], textFilter: string): CountryModel[] => {
    if (!textFilter.length) {
        return countries;
    }
    textFilter = textFilter.toLocaleLowerCase();
    const result = countries.filter(c => {
        return c.countryId.toString().includes(textFilter) ||
            c.countryName.toLocaleLowerCase().includes(textFilter) ||
            c.regionId.toLocaleString().includes(textFilter)
    });
    return result;
}
const _sort = (countries: CountryModel[], sortActive: string, ascending: boolean): CountryModel[] => {
    const result = [...countries];
    switch (sortActive) {
        case "countryId":
            result.sort((a, b) => a.countryId - b.countryId);
            break;
        case "countryName":
            result.sort((a, b) => a.countryName < b.countryName ? -1 : a.countryName > b.countryName ? 1 : 0);
            break;
        case "regionId":
            result.sort((a, b) => a.regionId - b.regionId);
            break;
        default:
            result.sort((a, b) => a.countryId - b.countryId);
    }
    if (ascending) return result;
    return result.reverse();
};

const _sliced = (countries: CountryModel[], pageIndex: number, pageSize: number) => {
    const start = pageIndex * pageSize;
    const end = start + pageSize;
    const sl = countries.slice(start, end);
    return [...sl];
};
const _filterByRegion = (countries: CountryModel[], byRegion: number | null) => {
    if (!byRegion) {

        return countries;
    }
    const result = countries.filter(c => c.regionId === byRegion);
    return result;
}

export const selectSharedCountriesState = createFeatureSelector<FromCountriesState.State>("[COUNTRIES]");
export const selectCountriesState = createSelector(
    selectSharedCountriesState,
    (sharedCountriesState) => sharedCountriesState.countries
);


export const selectLoading = createSelector(
    selectCountriesState,
    _selectLoading
);

export const selectCountryDetail = createSelector(
    selectCountriesState,
    _selectCountryDetail
);


export const selectPageIndex = createSelector(
    selectCountriesState,
    _selectPageIndex
);

export const selectPageSize = createSelector(
    selectCountriesState,
    _selectPageSize
);
export const selectAscending = createSelector(
    selectCountriesState,
    _selectAscending
);

export const selectSortActive = createSelector(
    selectCountriesState,
    _selectSortActive
);

const selectByRegion = createSelector(
    selectCountriesState,
    _selectByRegion
);

export const selectDialogId = createSelector(
    selectCountriesState,
    _selectDialogId
);

export const selectTextFilter = createSelector(
    selectCountriesState,
    _selectTextFilter
);


// TODO check if You gonna delete it
export const selectCountryDepartments = createSelector(
    selectCountryDetail,
    selectAllDepartments,
    _selectCountryDepartments,
);

export const selectAllCountries = createSelector(
    selectCountriesState,
    _selectAllCountries
);

// export const selectAllCountriesSorted = createSelector(
//     selectAllCountries,
//     selectSortActive,
//     selectAscending,
//     _sort
// );

// export const selectSortedCountriesSlice = createSelector(
//     selectAllCountriesSorted,
//     selectPageIndex,
//     selectPageSize,
//     _sliced
// );

export const selectAllRegionCountries = createSelector(
    selectAllCountries,
    selectByRegion,
    _filterByRegion
);

export const selectFilteredCountries = createSelector(
    selectAllRegionCountries,
    selectTextFilter,
    _filterByText
);

export const selectSortedCountries = createSelector(
    selectFilteredCountries,
    selectSortActive,
    selectAscending,
    _sort
);

export const selectCountriesPage = createSelector(
    selectSortedCountries,
    selectPageIndex,
    selectPageSize,
    _sliced
);

export const selectAllCountriesLength = createSelector(
    selectAllCountries,
    (countries) => {
        return countries.length;
    }
);

export const selectFilteredCountriesLength = createSelector(
    selectFilteredCountries,
    (countries) => countries.length
);

