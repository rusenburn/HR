import { Inject, Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { ActivatedRoute } from "@angular/router";
import { catchError, concatMap, exhaustAll, exhaustMap, map, mergeMap, of, switchMap } from "rxjs";
import { RegionsService } from "src/app/services/regions.service";
import * as RegionActions from "./regions.actions";

@Injectable()
export class RegionsApiEffects {
    constructor(private regionService: RegionsService, private actions$: Actions, private route: ActivatedRoute) { }

    readAll$ = createEffect(() => {
        return this.actions$.pipe(
            ofType(RegionActions.readAll),
            exhaustMap(() => {
                return this.regionService.getAll().pipe(
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
                    map(region => RegionActions.createOneSuccess({ region })),
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
                    map((region) => RegionActions.updateOneSuccess({ region })),
                    catchError((error) => of(RegionActions.updateOneFailure({ error })))
                )
            })
        )
    });


    paramMapChange$ = createEffect(() => {
        return this.route.paramMap.pipe(
            exhaustMap(param => {
                const regionId = +(param.get('regionId') || '0');
                console.log(`${regionId} region Id from effects`);
                if (regionId === 0) {
                    return of(RegionActions.readOneNever());
                }
                return this.regionService.getOne(regionId).pipe(
                    map(region => RegionActions.readOneSuccess({ region })),
                    catchError(error => of(RegionActions.readOneFailure({ error })))
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
    })


}