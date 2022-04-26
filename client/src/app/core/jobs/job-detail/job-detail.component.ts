import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable, Subject, takeUntil } from 'rxjs';
import { JobDetailModel } from 'src/app/models/jobs/job-detail.model';
import { readOneJob } from 'src/app/stores/jobs/jobs.actions';
import { selectJobDetail, selectLoading } from 'src/app/stores/jobs/jobs.selectors';

@Component({
  selector: 'app-job-detail',
  templateUrl: './job-detail.component.html',
  styleUrls: ['./job-detail.component.css']
})
export class JobDetailComponent implements OnInit, OnDestroy {
  job: JobDetailModel | null = null;
  job$: Observable<JobDetailModel | null>;
  loading$: Observable<boolean>;
  destory$ = new Subject<void>();

  constructor(
    private _route: ActivatedRoute,
    private _store: Store
  ) {
    this._store.select(selectJobDetail)
      .pipe(takeUntil(this.destory$))
      .subscribe(job => {
        this.job = job
      });
    this.job$ = this._store.select(selectJobDetail);
    this.loading$ = this._store.select(selectLoading);
  }

  ngOnInit(): void {
    this._route.paramMap
      .pipe(takeUntil(this.destory$))
      .subscribe(this.paramFn);
  }

  ngOnDestroy(): void {
    this.destory$.next();
    this.destory$.unsubscribe();
  }
  private paramFn = (paramMap: ParamMap): void => {
    const jobId = +(paramMap.get('jobId') || '0');
    if (jobId !== 0) {
      this._store.dispatch(readOneJob({ jobId }));
    }
  };
}
