import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { StoreModule } from '@ngrx/store';
import { AppRoutingModule } from './core/app-routing.module';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { environment } from '../environments/environment';

import { AppComponent } from './app.component';
import { AppConfig } from './app.config';
import { EffectsModule } from '@ngrx/effects';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { HomeComponent } from './core/home/home.component';
import { CoreModule } from './core/core.module';

@NgModule({
  declarations: [
    AppComponent,
    // HomeComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    StoreModule.forRoot({}, {}),
    StoreDevtoolsModule.instrument({ maxAge: 25, logOnly: environment.production }),
    EffectsModule.forRoot([]),
    BrowserAnimationsModule,
    CoreModule,
  ],
  providers: [
    { provide: AppConfig, useValue: new AppConfig() },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
