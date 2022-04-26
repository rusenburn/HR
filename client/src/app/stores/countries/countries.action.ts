import { createAction, props } from "@ngrx/store";
import { CountryCreateModel } from "src/app/models/countries/country-create.model";
import { CountryDetailModel } from "src/app/models/countries/country-detail.model";
import { CountryUpdateModel } from "src/app/models/countries/country-update.model";
import { CountryModel } from "src/app/models/countries/country.model";

export const readAll = createAction("[COUNTRIES] ReadAll");
export const createOne = createAction("[COUNTRIES] CreateOne", props<{ country: CountryCreateModel }>());
export const updateOne = createAction("[COUNTRIES] UpdateOne", props<{ country: CountryUpdateModel }>());
export const deleteOne = createAction("[COUNTRIES] DeleteOne", props<{ id: number }>());

// ACTIVATE ROUTE 
export const readOne = createAction("[COUNTRIES PARAM] ReadOne", props<{ countryId: number }>());


// API ACTIONS
export const readAllSuccess = createAction("[COUNTRIES API] ReadAllSuccess",props<{countries:CountryModel[]}>());
export const readAllFailure = createAction("[COUNTRIES API] ReadAllFailure",props<{error:Error}>());

export const createOneSuccess = createAction("[COUNTRIES API] CreateOneSuccess",props<{country:CountryModel}>())
export const createOneFailure = createAction("[COUNTRIES API] CreateOneSuccess",props<{error:Error}>())

export const updateOneSuccess = createAction("[COUNTRIES API] UpdateOneSuccess",props<{country:CountryModel}>())
export const updateOneFailure = createAction("[COUNTRIES API] UpdateOneFailure",props<{error:Error}>())

export const deleteOneSuccess = createAction("[COUNTRIES API] DeleteOneSuccess",props<{countryId:number}>())
export const deleteOneFailure = createAction("[COUNTRIES API] DeleteOneFailure",props<{error:Error}>())

export const readOneSuccess = createAction("[COUNTRIES API] ReadOneSuccess", props<{ country: CountryDetailModel }>());
export const readOneFailure = createAction("[COUNTRIES API] ReadOneFailure", props<{ error: Error }>());