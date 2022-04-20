import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { catchError, concatMap, exhaustMap, map, mergeMap, of } from "rxjs";
import { JobsService } from "src/app/services/jobs.service";
import * as JobsActions from "./jobs.actions";
@Injectable()
export class JobsEffects {
    constructor(private jobsService: JobsService, private actions$: Actions) { }

    readAll$ = createEffect(() => {
        return this.actions$.pipe(
            ofType(JobsActions.readAll),
            exhaustMap(() => {
                return this.jobsService.getAll().pipe(
                    map(jobs => JobsActions.readAllSuccess({ jobs })),
                    catchError(error => of(JobsActions.readAllFailure({ error })))
                )
            })
        )
    });

    createOne$ = createEffect(() => {
        return this.actions$.pipe(
            ofType(JobsActions.createOne),
            concatMap((action) => {
                return this.jobsService.createOne(action.job).pipe(
                    map(job => JobsActions.createOneSuccess({ job })),
                    catchError(error => of(JobsActions.createOneFailure({ error })))
                )
            })
        )
    });

    updateOne$ = createEffect(() => {
        return this.actions$.pipe(
            ofType(JobsActions.updateOne),
            concatMap((action) => {
                return this.jobsService.updateOne(action.job).pipe(
                    map(job => JobsActions.updateOneSuccess({ job })),
                    catchError(error => of(JobsActions.updateOneFailure({ error })))
                )
            })
        )
    });

    deleteOne$ = createEffect(() => {
        return this.actions$.pipe(
            ofType(JobsActions.deleteOne),
            mergeMap(action => {
                return this.jobsService.deleteOne(action.id).pipe(
                    map(() => JobsActions.deleteOneSuccess({ jobId: action.id })),
                    catchError(error => of(JobsActions.deleteOneFailure({ error })))
                )
            })
        )
    })
}