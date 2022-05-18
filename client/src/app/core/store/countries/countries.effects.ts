import { Injectable } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { Store } from "@ngrx/store";
import { catchError, concatMap, exhaustMap, map, mergeMap, of, withLatestFrom } from "rxjs";
import { CountriesService } from "src/app/core/http-services/countries.service";
import { CountryUpsertDialogComponent } from "src/app/shared/dialoges/country-upsert-dialog/country-upsert-dialog.component";
import * as CountriesActions from "./countries.action";
import { selectDialogId } from "./countries.selectors";

@Injectable()
export class CountriesApiEffects {
    constructor(private countriesService: CountriesService, private actions$: Actions, private dialog: MatDialog) { }
    readAll$ = createEffect(() => {
        return this.actions$.pipe(
            ofType(CountriesActions.readAll),
            exhaustMap((action) => {
                return this.countriesService.getAll({ ...action }).pipe(
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
                    map(country => {
                        if (this.dialog.openDialogs.length) {
                            this.dialog.closeAll();
                        }
                        return CountriesActions.createOneSuccess({ country })
                    }),
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
                    map(country => {
                        if (this.dialog.openDialogs.length) {
                            this.dialog.closeAll();
                        }
                        return CountriesActions.updateOneSuccess({ country })
                    }),
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

    readOne$ = createEffect(() => {
        return this.actions$.pipe(
            ofType(CountriesActions.readOne),
            exhaustMap(action => {
                return this.countriesService.getOne(action.countryId).pipe(
                    map((country) => CountriesActions.readOneSuccess({ country })),
                    catchError((error) => of(CountriesActions.readOneFailure({ error })))
                )
            })
        )
    });
}
@Injectable()
export class CountriesDialogEffects {
    constructor(private actions$: Actions, private store: Store, private dialog: MatDialog) { }



    openForm$ = createEffect(() => {
        return this.actions$.pipe(
            ofType(CountriesActions.openForm),
            map((action) => {
                const dialog = this.dialog.open(CountryUpsertDialogComponent, {
                    data: action.country
                });
                return CountriesActions.openFormSuccess({ dialogId: dialog.id });
            })
        );
    });

    upsertSuccess$ = createEffect(() => {
        return this.actions$.pipe(
            ofType(CountriesActions.updateOneSuccess, CountriesActions.createOneSuccess),
            withLatestFrom(this.store.select(selectDialogId)),
            map(([_, formId]) => {
                return CountriesActions.closeForm({ formId });
            })
        )
    });

    closeForm$ = createEffect(() => {
        return this.actions$.pipe(
            ofType(CountriesActions.closeForm),
            map(action => {
                const dialogRef = this.dialog.getDialogById(action.formId);
                dialogRef?.close();
                return CountriesActions.closeFormSuccess();
            })
        )
    });
}