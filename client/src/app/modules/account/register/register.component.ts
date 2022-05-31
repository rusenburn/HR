import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { Subject, takeUntil } from 'rxjs';
import { register, registerSuccess } from 'src/app/core/store/account/account.actions';
import { AccountRegisterModel } from 'src/app/models/account/account-register';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit, OnDestroy {
  registerForm: FormGroup;
  destroy$ = new Subject<void>();
  constructor(private _fb: FormBuilder, private _store: Store, private _router: Router,actions$:Actions) {
    this.registerForm = this._fb.group({
      username: ['', [Validators.required, Validators.minLength(3), Validators.max(15)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    })

    actions$.pipe(
      ofType(registerSuccess),
      takeUntil(this.destroy$))
      .subscribe(()=>{
        this._router.navigate(['/account/login']);
      })
  }

  ngOnInit(): void {
    document.title = "ACCOUNT | Register";
  }
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
  public submitForm(): void {
    const model = this.formToModel();
    console.log(model);
    this._store.dispatch(register({ credentials: model }));
  }
  private formToModel(): AccountRegisterModel {
    const model: AccountRegisterModel = {
      email: this.registerForm.value.email,
      username: this.registerForm.value.username,
      password: this.registerForm.value.password
    };
    return model;
  }
}
