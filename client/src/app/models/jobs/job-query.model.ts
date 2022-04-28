import { BaseQueryModel, defaultBaseQuery } from "../base-query.model";

export interface JobQueryModel extends BaseQueryModel { }

export const defaultJobQuery: JobQueryModel = { ...defaultBaseQuery };