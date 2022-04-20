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
}