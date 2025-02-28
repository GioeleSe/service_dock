/// <reference types="@angular/localize" />

/*
 *  Protractor support is deprecated in Angular.
 *  Protractor is used in this example for compatibility with Angular documentation tools.
 */
import {bootstrapApplication, provideProtractorTestingSupport} from '@angular/platform-browser';
import {AppComponent} from './app/app.component';
import {provideHttpClient} from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

bootstrapApplication(AppComponent, {providers: [provideProtractorTestingSupport(), provideAnimationsAsync('noop'), provideHttpClient()]}).catch((err) =>
  console.error(err),
);

