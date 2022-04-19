export interface LocationUpdateModel {
    locationId: number;
    streetAddress: string;
    postalCode: string | null;
    city: string;
    stateProvince: string;
    countryId: number;
}