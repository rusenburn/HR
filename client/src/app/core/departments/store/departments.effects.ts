import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { catchError, concatMap, exhaustMap, map, mergeMap, of } from "rxjs";
import { DepartmentsService } from "src/app/services/departments.service";
import { LocationsService } from "src/app/services/locations.service";
import * as DepartmentActions from "./departments.actions";
import * as LocationsActions from "../../locations/store/locations.actions";
import { DepartmentUpdateModel } from "src/app/models/departments/department-update.model";

@Injectable()
export class DepartmentsEffects {
    constructor(
        private departmentsService: DepartmentsService,
        private locationsService: LocationsService,
        private actions$: Actions) { }

    readAll$ = createEffect(() => {
        return this.actions$.pipe(
            ofType(DepartmentActions.readAll),
            exhaustMap(() => {
                return this.locationsService.getAll()
                // .pipe(
                //     map(locations => LocationsActions.readAllSuccess({ locations })),
                // catchError(error => of(DepartmentActions.readAllFailure({ error })))
                // )
            }),
            exhaustMap((locations) => {
                // const locations = action.locations;
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
                                map(department => DepartmentActions.createOneSuccess({ department, location })),
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
                            map(department => DepartmentActions.updateOneSuccess({ department, location })),
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