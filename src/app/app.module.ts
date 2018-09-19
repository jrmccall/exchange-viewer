import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { ListPage } from '../pages/list/list';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import {LibraryModule} from "../library/library.module";
import {StoreModule} from "../store/store.module";
import {HttpClientModule} from "@angular/common/http";
import {PairPage} from "../pages/pair/pair";
import {Http} from "@angular/http";
import {HttpModule} from "@angular/http";

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    ListPage,
    PairPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    LibraryModule,
    StoreModule,
    HttpClientModule,
    HttpModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    ListPage,
    PairPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    LibraryModule,
    HttpClientModule,
    HttpModule
  ]
})
export class AppModule {}
