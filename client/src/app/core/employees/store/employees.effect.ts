import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { catchError, concatMap, exhaustMap, map, mergeMap, of } from "rxjs";
import { EmployeesService } from "src/app/services/employees.service";
import * as EmployeesActions from "./employees.actions";

@Injectable()
export class EmployeesAPIEffects {
    constructor(private employeesService: EmployeesService, private actions$: Actions) { }

    readAll$ = createEffect(() =>
        this.actions$.pipe(
            ofType(EmployeesActions.readAll),
            exhaustMap(() => {
                return this.employeesService.getAll().pipe(
                    map((employees) => EmployeesActions.readAllSuccess({ employees })),
                    catchError(error => of(EmployeesActions.readAllFailure({ error })))
                )
            })
        )
    );

    createOne$ = createEffect(() => {
        return this.actions$.pipe(
            ofType(EmployeesActions.createOne),
            concatMap((action) => {
                return this.employeesService.createOne(action.employee).pipe(
                    map(employee => EmployeesActions.createOneSuccess({ employee })),
                    catchError(error => of(EmployeesActions.createOneFailure({ error })))
                )
            })
        )
    });

    updateOne$ = createEffect(() => {
        return this.actions$.pipe(
            ofType(EmployeesActions.updateOne),
            concatMap((action) => {
                return this.employeesService.updateOne(action.employee).pipe(
                    map(employee => EmployeesActions.updateOneSuccess({ employee })),
                    catchError(error => of(EmployeesActions.updateOneFailure({ error })))
                )
            })
        )
    });

    deleteOne$ = createEffect(() => {
        return this.actions$.pipe(
            ofType(EmployeesActions.deleteOne),
            mergeMap((action) => {
                return this.employeesService.deleteOne(action.id).pipe(
                    map(() => EmployeesActions.deleteOneSuccess({ employeeId: action.id })),
                    catchError(error => of(EmployeesActions.deleteOneFailure({ error })))
                )
            })
        )
    });

    readOne$ = createEffect(() => {
        return this.actions$.pipe(
            ofType(EmployeesActions.readOne),
            exhaustMap(action => {
                return this.employeesService.getOne(action.employeeId).pipe(
                    map((employeeDetail) => EmployeesActions.readOneSuccess({ employeeDetail })),
                    catchError(error => of(EmployeesActions.readOneFailure({ error })))
                )
            })
        )
    });

}