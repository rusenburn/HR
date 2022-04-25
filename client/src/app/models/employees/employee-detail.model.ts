import { JobHistoryModule } from "src/app/core/job-history/job-history.module";
import { DepartmentModel } from "../departments/department.model";
import { JobHistoryModel } from "../job-histories/job-history.model";
import { JobModel } from "../jobs/job.model";
import { EmployeeModel } from "./employee.model";

export interface EmployeeDetailModel{
    employeeId:number;
    firstName:string;
    lastName:string;
    email:string;
    phoneNumber:string;
    hireDate:string;
    salary:number|null;
    jobId:number|null;
    managerId:number|null;
    departmentId:number|null;
    job:JobModel;
    manager: EmployeeModel;
    department:DepartmentModel;
    jobHistories:JobHistoryModel[];
}