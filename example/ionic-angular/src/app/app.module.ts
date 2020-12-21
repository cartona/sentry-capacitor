import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import * as Sentry from '@sentry/capacitor';
import { Integrations } from '@sentry/tracing';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

// ATTENTION: Change the DSN below with your own to see the events in Sentry. Get one at sentry.io
Sentry.init({
  dsn:
    'https://48fce7f88fb54b8788d9242310630b52@o476433.ingest.sentry.io/5538147',
  // The type of framework, if any, used for the project
  // This option is necessary for overriding framework global handlers
  framework: 'angular',
  // An array of strings or regexps that'll be used to ignore specific errors based on their type/message
  ignoreErrors: [/MiddleEarth_\d\d/, 'RangeError'],
  // Debug mode with valuable initialization/lifecycle information
  debug: true,
  // Whether SDK should be enabled or not
  enabled: true,
  integrations: [new Integrations.BrowserTracing()],
  // A release identifier
  release: '1537345109360',
  // An environment identifier
  environment: 'staging',
  // We recommend adjusting this value in production, or using tracesSampler
  // for finer control
  tracesSampleRate: 1.0,
});

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [BrowserModule, IonicModule.forRoot(), AppRoutingModule],
  providers: [
    StatusBar,
    SplashScreen,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
