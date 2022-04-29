import { BaseQueryModel, defaultBaseQuery } from "../base-query.model";

export interface EmployeeQueryModel extends BaseQueryModel {
    jobId: number;
    departmentId: number;
    managerId: number;
};

export const defaultEmployeeQuery: EmployeeQueryModel = {
    ...defaultBaseQuery,
    jobId: 0,
    departmentId: 0,
    managerId: 0,
};