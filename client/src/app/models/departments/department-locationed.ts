import { LocationModel } from "../locations/location.model";

export interface DepartmentLocationedModel{
    departmentId:number;
    departmentName:string;
    locationId:number;
    location:LocationModel
}