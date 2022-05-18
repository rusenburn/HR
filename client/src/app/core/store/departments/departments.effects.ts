import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { catchError, concatMap, exhaustMap, map, mergeMap, of, withLatestFrom } from "rxjs";
import { DepartmentsService } from "src/app/core/http-services/departments.service";
import { LocationsService } from "src/app/core/http-services/locations.service";
import * as DepartmentActions from "./departments.actions";
import { DepartmentUpdateModel } from "src/app/models/departments/department-update.model";
import { MatDialog } from "@angular/material/dialog";
import { Store } from "@ngrx/store";
import { DepartmentsUpsertDialogComponent } from "src/app/shared/dialoges/departments-upsert-dialog/departments-upsert-dialog.component";
import { selectFormId } from "./departments.selectors";

@Injectable()
export class DepartmentsAPIEffects {
    constructor(
        private departmentsService: DepartmentsService,
        private locationsService: LocationsService,
        private actions$: Actions,
        private dialog: MatDialog) { }

    readAll$ = createEffect(() => {
        return this.actions$.pipe(
            ofType(DepartmentActions.readAll),
            exhaustMap(() => {
                return this.locationsService.getAll()
            }),
            exhaustMap((locations) => {
                return this.departmentsService.getAll().pipe(
                    map(departments => DepartmentActions.readAllSuccess({ departments, locations }))
                )
            }),
            catchError(error => of(DepartmentActions.readAllFailure({ error })))
        )
    });

    createOne$ = createEffect(() => {
        return this.actions$.pipe(
            ofType(DepartmentActions.createOne),
            concatMap((action) => {
                return this.locationsService.createOne(action.location)
                    .pipe(
                        concatMap((location) => {
                            const d = { ...action.department, locationId: location.locationId };
                            return this.departmentsService.createOne(d).pipe(
                                map(department => {
                                    if (this.dialog.openDialogs.length) {
                                        this.dialog.closeAll();
                                    }
                                    return DepartmentActions.createOneSuccess({ department, location })
                                }),
                                catchError(error => of(DepartmentActions.createOneFailure({ error })))
                            );
                        }),
                        catchError(error => of(DepartmentActions.createOneFailure(error)))
                    )
            }),
        )
    });


    updateOne$ = createEffect(() => {
        return this.actions$.pipe(
            ofType(DepartmentActions.updateOne),
            concatMap((action) => {
                return this.locationsService.updateOne(action.location).pipe(
                    concatMap((location) => {
                        const d: DepartmentUpdateModel = { ...action.department, locationId: location.locationId };
                        return this.departmentsService.updateOne(d).pipe(
                            map(department => {
                                if (this.dialog.openDialogs.length) {
                                    this.dialog.closeAll();
                                }
                                return DepartmentActions.updateOneSuccess({ department, location })
                            }),
                            catchError(error => of(DepartmentActions.updateOneFailure({ error })))
                        )
                    }),
                    catchError(error => of(DepartmentActions.updateOneFailure({ error })))
                )
            })
        )
    })

    deleteOne$ = createEffect(() => {
        return this.actions$.pipe(
            ofType(DepartmentActions.deleteOne),
            mergeMap((action) => {
                return this.departmentsService.deleteOne(action.departmentId).pipe(
                    map(() => DepartmentActions.deleteOneSuccess({ departmentId: action.departmentId })),
                    catchError(error => of(DepartmentActions.deleteOneFailure({ error })))
                )
            })
        )
    });

    readOne$ = createEffect(() => {
        return this.actions$.pipe(
            ofType(DepartmentActions.readOne),
            exhaustMap(action => {
                return this.departmentsService.getOne(action.departmentId).pipe(
                    map((department) => DepartmentActions.readOneSuccess({ department })),
                    catchError(error => of(DepartmentActions.readOneFailure({ error })))
                )
            })
        )
    });
}

@Injectable()
export class DepartmentsFormEffects {
    constructor(private actions$: Actions, private dialog: MatDialog, private store: Store) { }

    openForm$ = createEffect(() => {
        return this.actions$.pipe(
            ofType(DepartmentActions.openForm),
            map(action => {
                const dialogRef = this.dialog.open(DepartmentsUpsertDialogComponent, {
                    data: action.department,
                    disableClose: true
                })
                return DepartmentActions.openFormSuccess({ formId: dialogRef.id })
            })
        );
    });

    upsertSuccess$ = createEffect(() => {
        return this.actions$.pipe(
            ofType(DepartmentActions.updateOneSuccess, DepartmentActions.createOneSuccess),
            withLatestFrom(this.store.select(selectFormId)),
            map(([_, formId]) => {
                return DepartmentActions.closeForm({ formId })
            })
        )
    });

    closeForm$ = createEffect(() => {
        return this.actions$.pipe(
            ofType(DepartmentActions.closeForm),
            map(action => {
                const dialogRef = this.dialog.getDialogById(action.formId);
                dialogRef?.close();
                return DepartmentActions.closeFormSuccess()
            })
        );
    });
}