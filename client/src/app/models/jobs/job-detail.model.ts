import { EmployeeModel } from "../employees/employee.model";
import { JobHistoryModel } from "../job-histories/job-history.model";

export interface JobDetailModel{
    jobId:number;
    jobTitle:string;
    minSalary:number;
    maxSalary:number;
    employees:EmployeeModel[];
    jobHistories:JobHistoryModel[];
}