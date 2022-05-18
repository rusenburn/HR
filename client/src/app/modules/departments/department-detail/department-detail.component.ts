import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable, Subject, takeUntil } from 'rxjs';
import { DepartmentDetailModel } from 'src/app/models/departments/department-detail.model';
import { readOne } from 'src/app/stores/departments/departments.actions';
import { selectDepartmentDetail, selectLoading } from 'src/app/stores/departments/departments.selectors';

@Component({
  selector: 'app-department-detail',
  templateUrl: './department-detail.component.html',
  styleUrls: ['./department-detail.component.css']
})
export class DepartmentDetailComponent implements OnInit,OnDestroy {

  department: DepartmentDetailModel | null = null;
  department$: Observable<DepartmentDetailModel | null>;
  loading$: Observable<boolean>;
  destroy$ = new Subject<void>();

  constructor(private _store: Store, private _route: ActivatedRoute) {
    this._store.select(selectDepartmentDetail)
      .pipe(takeUntil(this.destroy$))
      .subscribe(department => {
        this.department = department;
      });
    this.department$ = this._store.select(selectDepartmentDetail);
    this.loading$ = this._store.select(selectLoading);
  }
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.unsubscribe();
  }

  ngOnInit(): void {
    this._route.paramMap.subscribe(this.subscribeFn);
  }


  subscribeFn = (param: ParamMap) => {
    const departmentId = +(param.get('departmentId') || '0');
    if (departmentId !== 0) {
      this._store.dispatch(readOne({ departmentId }));
    }
  }
}
