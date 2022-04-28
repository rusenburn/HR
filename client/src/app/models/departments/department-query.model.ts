import { BaseQueryModel, defaultBaseQuery } from "../base-query.model";

export interface DepartmentQueryModel extends BaseQueryModel { }

export const defaultDepartmentQuery: DepartmentQueryModel = { ...defaultBaseQuery };