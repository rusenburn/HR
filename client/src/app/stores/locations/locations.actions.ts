import { createAction, props } from "@ngrx/store";
import { LocationCreateModel } from "src/app/models/locations/location-create.model";
import { LocationUpdateModel } from "src/app/models/locations/location-update.model";
import { LocationModel } from "src/app/models/locations/location.model";


export const readAll = createAction("[LOCATIONS] ReadAll");
export const createOne = createAction("[LOCATIONS] CreateOne", props<{ location: LocationCreateModel }>());
export const updateOne = createAction("[LOCATIONS] UpdateOne", props<{ location: LocationUpdateModel }>());
export const deleteOne = createAction("[LOCATIONS] DeleteOne", props<{ locationId: number }>());

// API ACTIONS
export const readAllSuccess = createAction("[LOCATIONS API] ReadAllSuccess",props<{locations:LocationModel[]}>());
export const readAllFailure = createAction("[LOCATIONS API] ReadAllFailure",props<{error:Error}>());

export const createOneSuccess = createAction("[LOCATIONS API] CreateOneSuccess",props<{location:LocationModel}>())
export const createOneFailure = createAction("[LOCATIONS API] CreateOneSuccess",props<{error:Error}>())

export const updateOneSuccess = createAction("[LOCATIONS API] UpdateOneSuccess",props<{location:LocationModel}>())
export const updateOneFailure = createAction("[LOCATIONS API] UpdateOneFailure",props<{error:Error}>())

export const deleteOneSuccess = createAction("[LOCATIONS API] DeleteOneSuccess",props<{locationId:number}>())
export const deleteOneFailure = createAction("[LOCATIONS API] DeleteOneFailure",props<{error:Error}>())
