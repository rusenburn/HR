import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { map, Observable, Subject, takeUntil, withLatestFrom } from 'rxjs';
import { login } from 'src/app/core/store/account/account.actions';
import { selectLoggedIn, selectRedirectURL } from 'src/app/core/store/account/account.selectors';
import { AccountLoginModel } from 'src/app/models/account/account-login';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit,OnDestroy {
  loginForm: FormGroup;
  destroy$ = new Subject<void>();
  logged$: Observable<boolean>;
  constructor(
    private _fb: FormBuilder,
    private _store: Store,
    private _router: Router) {

    const redirect$ = this._store.select(selectRedirectURL);
    this.logged$ = this._store.select(selectLoggedIn)
    this.logged$
      .pipe(takeUntil(this.destroy$), withLatestFrom(redirect$))
      .subscribe(([logged, redirect]) => {
        if (logged) {
          this._router.navigate([redirect]);
        }
      });
    this.loginForm = this._fb.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {
    document.title = "Account | Login";
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
  public submitForm(): void {
    const model = this.formToModel()
    console.log(model);
    this._store.dispatch(login({ credentials: model }));
  }

  public formToModel(): FormData {
    const f = new FormData();
    f.append("username",this.loginForm.value.username);
    f.append("password",this.loginForm.value.password);
    // const model: AccountLoginModel = {
    //   username: this.loginForm.value.username,
    //   password: this.loginForm.value.password
    // };
    return f;
  }

  ngOnDestory(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

}

