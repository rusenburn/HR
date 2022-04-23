export interface JobHistoryModel{
    employeeId:number;
    startDate:Date;
    salary:number;
    endDate:Date|null;
    jobId:number|null;
    departmentId:number|null;
}