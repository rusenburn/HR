export interface EmployeeFilterModel {
    departmentId: number | null;
    managerId: number | null;
    jobId: number | null;
};

export const defaultEmployeeFilter: EmployeeFilterModel = {
    departmentId: null,
    managerId: null,
    jobId: null
}