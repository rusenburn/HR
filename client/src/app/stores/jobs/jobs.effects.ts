import { Injectable } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { Store } from "@ngrx/store";
import { catchError, concatMap, exhaustMap, map, mergeMap, of, withLatestFrom } from "rxjs";
import { JobsUpsertDialogComponent } from "src/app/shared/dialoges/jobs-upsert-dialog/jobs-upsert-dialog.component";
import { JobsService } from "src/app/services/jobs.service";
import * as JobsActions from "./jobs.actions";
import { selectFormId } from "./jobs.selectors";

@Injectable()
export class JobsEffects {
    constructor(private jobsService: JobsService, private actions$: Actions) { }

    readAll$ = createEffect(() => {
        return this.actions$.pipe(
            ofType(JobsActions.readAll),
            exhaustMap((action) => {
                return this.jobsService.getAll({ ...action }).pipe(
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
    });

    readOne$ = createEffect(() => {
        return this.actions$.pipe(
            ofType(JobsActions.readOneJob),
            exhaustMap(action => {
                return this.jobsService.getOne(action.jobId).pipe(
                    map((jobDetail) => JobsActions.readOneSuccess({ jobDetail })),
                    catchError(error => of(JobsActions.readOneFailure({ error })))
                )
            })
        )
    });
};


@Injectable()
export class JobsFormEffects {
    constructor(private store: Store, private dialog: MatDialog, private actions$: Actions) { }

    openForm$ = createEffect(() => {
        return this.actions$.pipe(
            ofType(JobsActions.openForm),
            map((action) => {
                const dialogRef = this.dialog.open(JobsUpsertDialogComponent, {
                    data: action.job,
                    disableClose: true,
                })
                return JobsActions.openFormSuccess({ formId: dialogRef.id })
            })
        )
    });

    upsertSuccess$ = createEffect(() => {
        return this.actions$.pipe(
            ofType(JobsActions.updateOneSuccess, JobsActions.createOneSuccess),
            withLatestFrom(this.store.select(selectFormId)),
            map(([_, formId]) => {
                return JobsActions.closeForm({ formId })
            })
        )
    });

    closeForm$ = createEffect(() => {
        return this.actions$.pipe(
            ofType(JobsActions.closeForm),
            map(action => {
                const dialogRef = this.dialog.getDialogById(action.formId);
                dialogRef?.close();
                return JobsActions.closeFormSuccess();
            })
        )
    });
}