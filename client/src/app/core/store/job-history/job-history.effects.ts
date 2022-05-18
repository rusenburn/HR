import { Injectable } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { Store } from "@ngrx/store";
import { catchError, concatMap, exhaustMap, map, mergeMap, of, withLatestFrom } from "rxjs";
import { JobHistoryService } from "src/app/core/http-services/job-history.service";
import { JobHistoryUpsertDialogComponent } from "src/app/shared/dialoges/job-history-upsert-dialog/job-history-upsert-dialog.component";
import * as JobHistoryActions from "./job-history.actions";
import { selectFormId } from "./job-history.selectors";

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

@Injectable()
export class JobHistoryFormEffects {
    constructor(private store: Store, private dialog: MatDialog, private actions$: Actions) { }

    openForm$ = createEffect(() => {
        return this.actions$.pipe(
            ofType(JobHistoryActions.openCreateForm, JobHistoryActions.openUpdateForm),
            map(action => {
                const dialogRef = this.dialog.open(JobHistoryUpsertDialogComponent, {
                    data: action.jobHistory,
                    disableClose: true
                });
                return JobHistoryActions.openFormSuccess({ formId: dialogRef.id });
            })
        );
    });

    upsertSuccess$ = createEffect(() => {
        return this.actions$.pipe(
            ofType(JobHistoryActions.updateOneSuccess, JobHistoryActions.createOneSuccess),
            withLatestFrom(this.store.select(selectFormId)),
            map(([_, formId]) => {
                return JobHistoryActions.closeForm({ formId });
            })
        );
    });

    closeForm$ = createEffect(() => {
        return this.actions$.pipe(
            ofType(JobHistoryActions.closeForm),
            map(action => {
                const dialogRef = this.dialog.getDialogById(action.formId);
                dialogRef?.close();
                return JobHistoryActions.closeFormSuccess();
            })
        );
    });

}