import { EmployeeModel } from "../employees/employee.model";
import { JobHistoryModel } from "../job-histories/job-history.model";
import { LocationModel } from "../locations/location.model";

export interface DepartmentDetailModel{
    departmentId:number;
    departmentName:string;
    locationId:number;
    location:LocationModel;
    employees:EmployeeModel[];
    jobHistories:JobHistoryModel[];
}