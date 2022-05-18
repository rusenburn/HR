import { Injectable } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { Store } from "@ngrx/store";
import { catchError, concatMap, exhaustMap, map, mergeMap, of, withLatestFrom } from "rxjs";
import { EmployeesService } from "src/app/core/http-services/employees.service";
import { EmployeeUpsertDialogComponent } from "src/app/shared/dialoges/employee-upsert-dialog/employee-upsert-dialog.component";
import * as EmployeesActions from "./employees.actions";
import { selectFormId } from "./employees.selectors";

@Injectable()
export class EmployeesAPIEffects {
    constructor(
        private employeesService: EmployeesService,
        private actions$: Actions,
        private dialog: MatDialog) { }

    readAll$ = createEffect(() =>
        this.actions$.pipe(
            ofType(EmployeesActions.readAll),
            exhaustMap((action) => {
                return this.employeesService.getAll({ ...action }).pipe(
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
                    map(employee => {
                        if (this.dialog.openDialogs.length) {
                            this.dialog.closeAll();
                        }
                        return EmployeesActions.createOneSuccess({ employee })
                    }),
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
                    map(employee => {
                        if (this.dialog.openDialogs.length) {
                            this.dialog.closeAll();
                        }
                        return EmployeesActions.updateOneSuccess({ employee })
                    }),
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

};
@Injectable()
export class EmployeesFormEffects {
    constructor(private actions$: Actions, private store: Store, private dialog: MatDialog) { }

    openForm$ = createEffect(() => {
        return this.actions$.pipe(
            ofType(EmployeesActions.openForm),
            map((action) => {
                const dialogRef = this.dialog.open(EmployeeUpsertDialogComponent, {
                    data: action.employee,
                    disableClose: true
                });

                return EmployeesActions.openFormSuccess({ formId: dialogRef.id });
            })
        )
    });

    upsertSuccess$ = createEffect(() => {
        return this.actions$.pipe(
            ofType(EmployeesActions.updateOneSuccess, EmployeesActions.createOneSuccess),
            withLatestFrom(this.store.select(selectFormId)),
            map(([_, formId]) => {
                return EmployeesActions.closeForm({ formId });
            })
        )
    });

    closeForm$ = createEffect(() => {
        return this.actions$.pipe(
            ofType(EmployeesActions.closeForm),
            map(action => {
                const dialogRef = this.dialog.getDialogById(action.formId);
                dialogRef?.close();
                return EmployeesActions.closeFormSuccess();
            })
        );
    });
}