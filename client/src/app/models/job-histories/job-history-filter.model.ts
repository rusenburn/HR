export interface JobHistoryFilterModel{
    employeeId:number;
    jobId:number;
    departmentId:number;
}

export const defaultJobHistoryFilter:JobHistoryFilterModel={
    employeeId: 0,
    jobId: 0,
    departmentId: 0
}