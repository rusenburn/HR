import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { catchError, concatMap, exhaustMap, map, mergeMap, of, withLatestFrom } from "rxjs";
import { RegionsService } from "src/app/core/http-services/regions.service";
import * as RegionActions from "./regions.actions";
import { MatDialog } from "@angular/material/dialog";
import { RegionQueryModel } from "src/app/models/regions/region-query.model";
import { Store } from "@ngrx/store";
import { selectDialogRefId } from "./regions.selectors";
import { RegionUpsertDialogComponent } from "src/app/shared/dialoges/region-upsert-dialog/region-upsert-dialog.component";



@Injectable()
export class RegionsApiEffects {
    constructor(private regionService: RegionsService, private actions$: Actions, private dialog: MatDialog, private store$: Store) {
    }

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
            // withLatestFrom(this.store$.select(selectDialogRefId)),
            concatMap((action ) => {
                return this.regionService.createOne(action.region).pipe(
                    map(region => {
                        return RegionActions.createOneSuccess({ region })
                    }),
                    catchError(error => of(RegionActions.createOneFailure({ error })))
                )
            })
        )
    });

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
    });

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

    upsertSuccess = createEffect(() => {
        return this.actions$.pipe(
            ofType(RegionActions.updateOneSuccess, RegionActions.createOneSuccess),
            withLatestFrom(this.store$.select(selectDialogRefId)),
            map(([_, formId]) => {
                return RegionActions.closeForm({ formId });
            })
        )
    })

    openForm$ = createEffect(() => {
        return this.actions$.pipe(
            ofType(RegionActions.openForm),
            map((action) => {
                const dialog = this.dialog.open(RegionUpsertDialogComponent, {
                    data: { ...action.region },
                    disableClose:true,
                });
                return RegionActions.openFormSuccess({ matDialogRefId: dialog.id });
            })
        );
    });
    closeForm$ = createEffect(() => {
        return this.actions$.pipe(
            ofType(RegionActions.closeForm),
            map(action => {
                const dialogRef = this.dialog.getDialogById(action.formId);
                dialogRef?.close();
                return RegionActions.closeFormSuccess();
            })
        )
    });
}