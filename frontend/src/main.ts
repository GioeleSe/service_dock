/// <reference types="@angular/localize" />

/*
 *  Protractor support is deprecated in Angular.
 *  Protractor is used in this example for compatibility with Angular documentation tools.
 */
import {bootstrapApplication, provideProtractorTestingSupport} from '@angular/platform-browser';
import {AppComponent} from './app/app.component';
import {provideHttpClient} from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import {provideRouter} from "@angular/router";
import { routes } from './app/app.routes';

bootstrapApplication(AppComponent, {providers: [provideProtractorTestingSupport(), provideAnimationsAsync('noop'), provideHttpClient(), provideRouter(routes)]}).catch((err) =>
  console.error(err),
);

