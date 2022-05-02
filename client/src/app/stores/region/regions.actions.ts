import { createAction, props } from "@ngrx/store";
import { RegionCreateModel } from "src/app/models/regions/region-create.model";
import { RegionDetailModel } from "src/app/models/regions/region-detail.model";
import { RegionQueryModel } from "src/app/models/regions/region-query.model";
import { RegionUpdateModel } from "src/app/models/regions/region-update.model";
import { RegionModel } from "src/app/models/regions/region.model";

export const readAll = createAction("[REGIONS] ReadAll", props<RegionQueryModel>());
export const createOne = createAction("[REGIONS] CreateOne", props<{ region: RegionCreateModel }>());
export const updateOne = createAction("[REGIONS] UpdateOne", props<{ region: RegionUpdateModel }>());
export const deleteOne = createAction("[REGIONS] DeleteOne", props<{ id: number }>());

export const paginationChanged = createAction("[REGIONS] PaginationChanged", props<{ pageIndex: number, pageSize: number }>());
export const sortChanged = createAction("[REGIONS] SortChanged", props<{ active: string, asc: boolean }>());
export const textFilterChanged = createAction("[REGIONS] TextFilterChanged", props<{ textFilter: string }>());
export const resetTextFilter = createAction("[REGIONS] ResetTextFilter");
// PARAMS ACTIONS // ROUTE ACTIONS
export const readOne = createAction("[REGIONS PARAM] ReadOne", props<{ regionId: number }>());


// API ACTIONS
export const readAllSuccess = createAction("[REGIONS API] ReadAllSuccess", props<{ regions: RegionModel[] }>());
export const readAllFailure = createAction("[REGIONS API] ReadAllFailure", props<{ error: Error }>());

export const createOneSuccess = createAction("[REGIONS API] CreateOneSuccess", props<{ region: RegionModel }>());
export const createOneFailure = createAction("[REGIONS API] CreateOneSuccess", props<{ error: Error }>());

export const updateOneSuccess = createAction("[REGIONS API] UpdateOneSuccess", props<{ region: RegionModel }>());
export const updateOneFailure = createAction("[REGIONS API] UpdateOneFailure", props<{ error: Error }>());

export const deleteOneSuccess = createAction("[REGIONS API] DeleteOneSuccess", props<{ regionId: number }>());
export const deleteOneFailure = createAction("[REGIONS API] DeleteOneFailure", props<{ error: Error }>());

export const readOneSuccess = createAction("[REGIONS API] ReadOneSuccess", props<{ region: RegionDetailModel }>());
export const readOneFailure = createAction("[REGIONS API] ReadOneFailure", props<{ error: Error }>());

// FORM
export const openForm = createAction("[REGIONS FORM] OpenForm", props<{ region: RegionUpdateModel | null }>());
export const openFormSuccess = createAction("[REGIONS FORM] OpenFormSuccess", props<{ matDialogRefId: string }>());
export const closeForm = createAction("[REGIONS FORM] CloseForm", props<{ formId: string }>());
export const closeFormSuccess = createAction("[REGIONS FORM] CloseFormSuccess");