import { CountryModel } from "../countries/country.model";

export interface RegionDetailModel{
    regionId:number,
    regionName:string,
    countries:Array<CountryModel>,
}