import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { logout, updateLoggingInfo } from './core/store/account/account.actions';
import { selectLoggedIn, selectUsername } from './core/store/account/account.selectors';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  title = 'client';
  logged$:Observable<boolean>;
  username$:Observable<string>;
  constructor(private _store:Store){
    this.logged$ = this._store.select(selectLoggedIn);
    this.username$ = this._store.select(selectUsername);
  }
  ngOnInit(): void {
    this._store.dispatch(updateLoggingInfo());
  }

  public onLogout():void{
    this._store.dispatch(logout());
  }
}
