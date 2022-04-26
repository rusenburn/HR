import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { catchError, concatMap, exhaustMap, map, mergeMap, of } from "rxjs";
import { LocationsService } from "src/app/services/locations.service";
import * as LocationsActions from "./locations.actions";
@Injectable()
export class LocationsApiEffects {
    constructor(private locationsService: LocationsService, private actions$: Actions) { }

    readAll$ = createEffect(() => {
        return this.actions$.pipe(
            ofType(LocationsActions.readAll),
            exhaustMap(() => {
                return this.locationsService.getAll().pipe(
                    map(locations => LocationsActions.readAllSuccess({ locations })),
                    catchError(error => of(LocationsActions.readAllFailure({ error })))
                )
            })
        )
    });

    readOne$ = createEffect(() => {
        return this.actions$.pipe(
            ofType(LocationsActions.createOne),
            concatMap((action) => {
                return this.locationsService.createOne(action.location).pipe(
                    map(location => LocationsActions.createOneSuccess({ location })),
                    catchError(error => of(LocationsActions.createOneFailure({ error })))
                )
            })
        )
    });

    updateOne$ = createEffect(() => {
        return this.actions$.pipe(
            ofType(LocationsActions.updateOne),
            concatMap((action) => {
                return this.locationsService.updateOne(action.location).pipe(
                    map(location => LocationsActions.updateOneSuccess({ location })),
                    catchError(error => of(LocationsActions.updateOneFailure({ error })))
                )
            })
        )
    });

    deleteOne$ = createEffect(() => {
        return this.actions$.pipe(
            ofType(LocationsActions.deleteOne),
            mergeMap(action => {
                return this.locationsService.deleteOne(action.locationId).pipe(
                    map(() => LocationsActions.deleteOneSuccess({ locationId: action.locationId })),
                    catchError(error => of(LocationsActions.deleteOneFailure({ error })))
                )
            })
        )
    });
}