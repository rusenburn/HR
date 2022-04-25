export interface JobHistoryModel{
    employeeId:number;
    startDate:string;
    salary:number;
    endDate:string|null;
    jobId:number|null;
    departmentId:number|null;
}