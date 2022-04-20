export interface EmployeeModel{
    employeeId:number;
    firstName:string;
    lastName:string;
    email:string;
    phoneNumber:string;
    hireDate:Date|null;
    salary:number|null;
    jobId:number|null;
    managerId:number|null;
    departmentId:number|null;
}