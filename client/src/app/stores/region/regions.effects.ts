import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { catchError, concatMap, exhaustMap, map, mergeMap, of } from "rxjs";
import { RegionsService } from "src/app/services/regions.service";
import * as RegionActions from "./regions.actions";
import { MatDialog, MatDialogRef, } from "@angular/material/dialog";
import { RegionUpsertDialogComponent } from "src/app/core/regions/region-upsert-dialog/region-upsert-dialog.component";
import { RegionQueryModel } from "src/app/models/regions/region-query.model";



@Injectable()
export class RegionsApiEffects {
    constructor(private regionService: RegionsService, private actions$: Actions, private dialog: MatDialog) { }

    readAll$ = createEffect(() => {
        return this.actions$.pipe(
            ofType(RegionActions.readAll),
            exhaustMap((action) => {
                const query: RegionQueryModel = {
                    limit: action.limit,
                    skip: action.skip
                };
                return this.regionService.getAll(query).pipe(
                    map(regions => RegionActions.readAllSuccess({ regions })),
                    catchError(error => of(RegionActions.readAllFailure({ error })))
                )
            })
        )
    });

    createOne$ = createEffect(() => {
        return this.actions$.pipe(
            ofType(RegionActions.createOne),
            concatMap((action) => {
                return this.regionService.createOne(action.region).pipe(
                    map(region => {
                        if (this.dialog.openDialogs.length) {
                            this.dialog.closeAll();
                        }
                        return RegionActions.createOneSuccess({ region })
                    }),
                    catchError(error => of(RegionActions.createOneFailure({ error })))
                )
            })
        )
    })

    deleteOne$ = createEffect(() => {
        return this.actions$.pipe(
            ofType(RegionActions.deleteOne),
            mergeMap((action) => {
                return this.regionService.deleteOne(action.id).pipe(
                    map(() => RegionActions.deleteOneSuccess({ regionId: action.id })),
                    catchError(error => of(RegionActions.deleteOneFailure({ error })))
                )
            })
        )
    })

    updateOne$ = createEffect(() => {
        return this.actions$.pipe(
            ofType(RegionActions.updateOne),
            concatMap((action) => {
                return this.regionService.updateOne(action.region).pipe(
                    map((region) => {
                        if (this.dialog.openDialogs.length) {
                            this.dialog.closeAll();
                        }
                        return RegionActions.updateOneSuccess({ region })
                    }),
                    catchError((error) => of(RegionActions.updateOneFailure({ error })))
                )
            })
        )
    });

    readOne$ = createEffect(() => {
        return this.actions$.pipe(
            ofType(RegionActions.readOne),
            exhaustMap((action) => {
                return this.regionService.getOne(action.regionId).pipe(
                    map(region => RegionActions.readOneSuccess({ region })),
                    catchError(error => of(RegionActions.readOneFailure({ error })))
                )
            })
        )
    });

    // paginationChanged$ = createEffect(() => {
    //     return this.actions$.pipe(
    //         ofType(RegionActions.paginationChanged),
    //         exhaustMap(x => of(RegionActions.readAll(x)))
    //     )
    // });
}