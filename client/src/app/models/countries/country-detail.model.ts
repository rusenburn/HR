import { RegionModel } from "../regions/region.model";

export interface CountryDetailModel{
    countryId:number;
    countryName:string;
    regionId:number;
    region:RegionModel
}