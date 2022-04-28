import { BaseQueryModel, defaultBaseQuery } from "../base-query.model";

export interface CountryQueryModel extends BaseQueryModel { };

export const defaultCountryQuery: CountryQueryModel = { ...defaultBaseQuery };