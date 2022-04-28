import { BaseQueryModel } from "../base-query.model";
import { defaultBaseQuery } from "../base-query.model";
export interface RegionQueryModel extends BaseQueryModel {}

export const defaultRegionQuery :RegionQueryModel = {...defaultBaseQuery};