export interface EmployeeUpdateModel{
    employeeId:number;
    firstName:string;
    lastName:string;
    email:string;
    phoneNumber:string;
    managerId:number|null;
}