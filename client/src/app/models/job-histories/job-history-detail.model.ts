import { DepartmentModel } from "../departments/department.model";
import { EmployeeModel } from "../employees/employee.model";
import { JobModel } from "../jobs/job.model";

export interface JobHistoryDetailModel {
    employeeId: number;
    startDate: string;
    salary: number;
    endDate: string | null;
    jobId: number | null;
    departmentId: number | null;
    employee: EmployeeModel;
    department: DepartmentModel | null;
    job: JobModel | null;
}