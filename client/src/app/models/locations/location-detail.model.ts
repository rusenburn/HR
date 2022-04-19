import { CountryModel } from "../countries/country.model";

export interface locationDetailModel{
    locationId:number;
    streetAddress:string;
    postalCode:string|null;
    city:string;
    stateProvince:string;
    countryId:number;
    country:CountryModel;
}