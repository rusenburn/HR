import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { catchError, concatMap, exhaustMap, map, mergeMap, of } from "rxjs";
import { JobHistoryService } from "src/app/services/job-history.service";
import * as JobHistoryActions from "./job-history.actions";
@Injectable()
export class JobHistoryAPIEffects {
    constructor(private jobHistoryService: JobHistoryService, private actions$: Actions) { }

    readAll$ = createEffect(() => {
        return this.actions$.pipe(
            ofType(JobHistoryActions.readAll),
            exhaustMap(() => {
                return this.jobHistoryService.getAll().pipe(
                    map(jobHistoryList => JobHistoryActions.readAllSuccess({ jobHistoryList })),
                    catchError(error => of(JobHistoryActions.readAllFailure({ error })))
                )
            })
        )
    });

    createOne$ = createEffect(() => {
        return this.actions$.pipe(
            ofType(JobHistoryActions.createOne),
            concatMap((action) => {
                return this.jobHistoryService.createOne(action.jobHistory).pipe(
                    map(jobHistory => JobHistoryActions.createOneSuccess({ jobHistory })),
                    catchError(error => of(JobHistoryActions.createOneFailure({ error })))
                )
            })
        )
    });

    updateOne$ = createEffect(() => {
        return this.actions$.pipe(
            ofType(JobHistoryActions.updateOne),
            concatMap((action) => {
                return this.jobHistoryService.updateOne(action.jobHistory).pipe(
                    map(jobHistory => JobHistoryActions.updateOneSuccess({ jobHistory })),
                    catchError(error => of(JobHistoryActions.updateOneFailure({ error })))
                )
            })
        )
    });

    deleteOne$ = createEffect(() => {
        return this.actions$.pipe(
            ofType(JobHistoryActions.deleteOne),
            mergeMap((action) => {
                return this.jobHistoryService.deleteOne(action.employeeId, action.startDate).pipe(
                    map(() => JobHistoryActions.deleteOneSuccess({ employeeId: action.employeeId, startDate: action.startDate })),
                    catchError(error => of(JobHistoryActions.deleteOneFailure({ error })))
                )
            })
        )
    });
}