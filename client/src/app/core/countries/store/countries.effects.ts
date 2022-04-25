import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { catchError, concatMap, exhaustMap, map, mergeMap, of } from "rxjs";
import { CountriesService } from "src/app/services/countries.service";
import * as CountriesActions from "./countries.action";

@Injectable()
export class CountriesApiEffects {
    constructor(private countriesService: CountriesService, private actions$: Actions) { }
    readAll$ = createEffect(() => {
        return this.actions$.pipe(
            ofType(CountriesActions.readAll),
            exhaustMap(() => {
                return this.countriesService.getAll().pipe(
                    map(countries => CountriesActions.readAllSuccess({ countries })),
                    catchError(error => of(CountriesActions.readAllFailure({ error })))
                )
            })
        )
    });


    createOne$ = createEffect(() => {
        return this.actions$.pipe(
            ofType(CountriesActions.createOne),
            concatMap((action) => {
                return this.countriesService.createOne(action.country).pipe(
                    map(country => CountriesActions.createOneSuccess({ country })),
                    catchError(error => of(CountriesActions.createOneFailure({ error })))
                )
            })
        )
    });

    updateOne$ = createEffect(() => {
        return this.actions$.pipe(
            ofType(CountriesActions.updateOne),
            concatMap(action => {
                return this.countriesService.updateOne(action.country).pipe(
                    map(country => CountriesActions.updateOneSuccess({ country })),
                    catchError(error => of(CountriesActions.updateOneFailure({ error })))
                )
            })
        )
    });

    deleteOne$ = createEffect(() => {
        return this.actions$.pipe(
            ofType(CountriesActions.deleteOne),
            mergeMap(action => {
                return this.countriesService.deleteOne(action.id).pipe(
                    map(() => CountriesActions.deleteOneSuccess({ countryId: action.id })),
                    catchError(error => of(CountriesActions.deleteOneFailure({ error })))
                )
            })
        )
    });

    readOne$ = createEffect(()=>{
        return this.actions$.pipe(
            ofType(CountriesActions.readOne),
            exhaustMap(action=>{
                return this.countriesService.getOne(action.countryId).pipe(
                    map((country)=>CountriesActions.readOneSuccess({country})),
                    catchError((error)=>of(CountriesActions.readOneFailure({error})))
                )
            })
        )
    });
}